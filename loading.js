import { BehaviorSubject } from 'rxjs';

const $loading = new BehaviorSubject(false);
const $failMessage = new BehaviorSubject('');
function load() {
  $loading.next(true);
}

function loadFailed(e) {
  $failMessage.next(''+e);
  throw e;
}
function loadDone() {
  $loading.next(false);
}
const loading = {load,loadDone,loadFailed};
function Progress(target, property, descriptor) {
  const fn = descriptor.value;
	descriptor.value = async function() {
    loading.load();
		try {
        return await fn.apply(this, arguments);
		} catch (e) {
      loading.loadFailed(e);
			throw e;
		} finally {
      loading.loadDone();
		}
  }

}
export {$loading, $failMessage, loading, Progress};
