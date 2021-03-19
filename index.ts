const localstorage_key = `tab-ts`;

let id = '';
const a = "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM_-";
for (let i = 0; i < 32; i++) id += a[Math.floor(Math.random() * a.length)];


if (!!window.SharedWorker) {
	//const worker = new SharedWorker(`sharedworker.js`);

	//worker.port.postMessage([first.value, second.value]);
	//console.log('Message posted to worker');

	/*
	worker.port.onmessage = function(e) {
		console.log('Message received from worker');
		console.log(e.lastEventId);
	}

	 */
}

interface tab_data {
	id: string
	ts: number
	visible: boolean
}

const tabs: {[key: string]: tab_data} = {};

let is_current: boolean = false;

const update = () => {
	let last: tab_data | null = null;
	for (const [, v] of Object.entries(tabs)) {
		if (!last || v.ts > last.ts) last = v;
	}
	is_current = last ? last.id === id : false;
	document.title = is_current ? `+` : `-`;
}

const event = () => {
	const obj: tab_data = {
		id     : id,
		ts     : Date.now(),
		visible: document.visibilityState === `visible`
	};
	localStorage.setItem(localstorage_key, JSON.stringify(obj));
	tabs[id] = obj;
	update();
}

window.addEventListener(`storage`, e => {
	if (e.key !== localstorage_key) return;
	const obj = JSON.parse(e.newValue || `{}`);
	if (obj.hasOwnProperty(`remove`)) delete tabs[obj.remove];
	else tabs[obj.id] = obj;
	update();
});

document.addEventListener(`DOMContentLoaded`, event);
document.addEventListener(`visibilitychange`, event);
window.addEventListener(`beforeunload`, () => {
	localStorage.setItem(localstorage_key, JSON.stringify({remove: id}));
});

// noinspection JSUnusedGlobalSymbols
const is_tab_active = (): boolean => {
	return true;
}

export {is_tab_active};