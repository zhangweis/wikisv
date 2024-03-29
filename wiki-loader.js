import * as marked from 'marked';
import IndexTable from './IndexTable';
const renderer = new marked.Renderer();
function sanitize(str) {
  return str.replace(/&<"/g, function (m) {
    if (m === "&") return "&amp;"
    if (m === "<") return "&lt;"
    return "&quot;"
  })
}
function generateBoundary() {
  // This generates a 50 character boundary similar to those used by Firefox.
  // They are optimized for boyer-moore parsing.
	var boundary='';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  return `<${boundary}>`;
};

function linkUrl(href,from) {
  var exec;
  exec = /^wiki:(.*)$/.exec(href);
  if (exec && exec[1]) return '#/wiki/'+exec[1];
  exec = /^b:\/\/(.*)$/.exec(href);
	if (exec && exec[1]) return (from=='img'?'https://lol.bitdb.network/assets/1BvPxwDoz6DR9qedZrKJjWio6Gm7UCPGXU/raw/':'https://bico.media/')+exec[1];
	return href;
}
renderer.image = function (src, title, alt) {
  const exec = /=\s*(\d*)\s*x\s*(\d*)\s*$/.exec(title)
  let res = '<img src="' + linkUrl(sanitize(src), 'img') + '" alt="' + sanitize(alt)
  if (exec && exec[1]) res += '" height="' + exec[1]
  if (exec && exec[2]) res += '" width="' + exec[2]
  return res + '">'
}
var oldSlug = marked.Slugger.prototype.slug;
marked.Slugger.prototype.slug =function (value){
	this.lastSlug = oldSlug.apply(this, arguments);
  return this.lastSlug;
}
var oldHeading = renderer.heading;
var headings = [];
renderer.addBoundary=function(content){
	if (!this.separator) {
		this.separator=generateBoundary();
		this.separatorCount=0;
	}
	this.separatorCount++;
	return this.separator+content+this.separator;
}
renderer.heading = function(text, level, raw, slugger) {
	var ret = oldHeading.apply(this, arguments);
	
	if (headings.length ==0) ret = this.addBoundary('<index-table/>')+ret;
	headings.push( {text,level,raw, slugId: slugger.lastSlug});
	return ret;
}
var oldLink = renderer.link;
renderer.link = function(href, title, text) {

  return oldLink.apply(this, [linkUrl(href),title,text]);
}
marked.setOptions({
breaks:true,
link:function(cap){
  return {href:'wiki:'+cap[1],title:null};
},
renderer
});

class Loader {
	async recentPages({limit=20}) {
		var list = [];
		var temp = [];
		do {
			var query = {nameFilter:{"$exists":true,"$ne":"|"},limit:20};
			if (temp.length>0&&temp[temp.length-1].tx.blk) query.beforeBlock = temp[temp.length-1].tx.blk.i;
			var wikis = await this.loadWikis(query);
			var pages = wikis.u.concat(wikis.c).map((tx)=>this.toContent(tx));
			temp = pages;
			pages.forEach((page)=>{if (!list.find(p1=>p1.name==page.name)) list.push(page)});
			if (pages.length==0||list.length>=limit) {
				list.length = Math.min(list.length, limit);
				return list;
			}
		} while(pages.length>0&&list.length<limit);
	}
	async recentChanges({name,limit=20}) {
		var wikis = await this.loadWikis({nameFilter:{$in: [name,name+'.md']}, limit:limit});
		var pages = wikis.u.concat(wikis.c).map(wiki=>this.toContent(wiki));
		return pages;
	}
	async loadWikis({nameFilter, limit=2,find,beforeBlock}) {
var query = 
{
  "v": 3,
  "q": {
    "find": {
      "out":{
        "$elemMatch": {"$or":[
				{
          "s1": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut",
          "s3": "text/markdown",
          "s5": nameFilter
          },
				{
          "s2": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut",
          "s4": "text/markdown",
          "s6": nameFilter
          }
					]}
      }
    },
    "project": {
      "out.ls2":1,
      "out.s2":1,
      "out.s5":1,
      "out.s3":1,
      "out.ls3":1,
			"tx.h":1,
			"blk":1,
      "out.s6":1
    },
    "sort": {
      "blk.i": -1, "i": -1
    },
    "limit": limit
  }
};
if (beforeBlock) {
	query.q.find["blk.i"]={"$lt":beforeBlock}
}
if (find) {
  query.q.find = find;
}
console.log(JSON.stringify(query));
var str = JSON.stringify(query);
var b64 = btoa(unescape(encodeURIComponent(str)))
//btoa(JSON.stringify(query));
var url = "https://neongenesis.bitdb.network/q/1HcBPzWoKDL2FhCMbocQmLuFTYsiD73u1j/" + b64;
//var url = "https://genesis.bitdb.network/q/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/" + b64;

var header = {
  headers: { key: "18doZeakgc7BeKs2L1ZWKMnoJnRQmoJy2i" }
};
var json = await (await fetch(url, header)).json();
json.u.reverse();
	return json;
}
  async load(params) {
var name = params.page;
var queries = {nameFilter:{$in: [name,name+'.md']}, limit: 2};
if (params.type=='tx') {
  queries.find = {"tx.h":params.page};
}

var json = (await this.loadWikis(queries));
var tx =(json.u[0]||json.c[0]);
return this.toContent(tx);
}
	toContent(tx) {
		if (!tx) return tx;
		var oldFormat = tx.out[0].s2!='19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut';
		var content = oldFormat?tx.out[0].s2||tx.out[0].ls2:tx.out[0].s3||tx.out[0].ls3;
		var page = {content,tx,name:oldFormat?tx.out[0].s5:tx.out[0].s6};
		if (page.name.substring(page.name.length-3)=='.md') {
			page.name = page.name.substring(0, page.name.length -3);
		}
		return page;
	}
	async marked(content, replaces={'<index-table/>':'<index-table :headings="headings" :page="page" :init-shown="tocInitShown"/>'}) {
		headings = [];
		var ret;
		var errorCount = 0;
		do {
		delete renderer.boundary;
		renderer.separatorCount = 0;
		ret = marked(content);
		var indexTableHtml='';
		} while (errorCount++<3&&renderer.separatorCount&&renderer.separatorCount*2!=ret.split(renderer.separator).length-1);
		var retObj = {headings, html:!ret?ret:'<div>'+ret+'</div>'};
		retObj=Object.assign(retObj, {separator:renderer.separator,replace:function(from,to){this.html=this.html.replace(this.separator+from+this.separator,to)}});
		retObj.toComponent=function(data){
			return {
				template: this.html,
				components:{
					IndexTable
				},
			 data:()=>{
			 	return Object.assign({headings:this.headings}, data());
			 }
			};
		};

		Object.keys(replaces).forEach(key=>{
			retObj.replace(key,replaces[key]);
		});
		return retObj;
	}
}
export default new Loader();

