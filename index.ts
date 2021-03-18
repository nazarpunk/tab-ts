class ActiveTab {
	static is_init: boolean = false;
	static key: string = `active-tab`;
	static id: number = performance.now();
	static is_current: boolean = true;

	static tabs: {
		[key: number]: {
			id: 0,
			ts: 0,
			visible: boolean
		}
	} = {};

	static on_update() {
		let last: {
			id: number,
			ts: number
		} = {
			id: 0,
			ts: 0
		};
		for (const [, v] of Object.entries(this.tabs)) {
			if (v.ts > last.ts) last = v;
		}
		this.is_current = last.id === this.id;
		document.title = this.is_current ? `---` : `0`;
	}

	static on_visibility_change() {
		const obj: {
			id: number,
			ts: number,
			visible: boolean
		} = {
			id     : this.id,
			ts     : performance.now(),
			visible: document.visibilityState === `visible`
		};
		localStorage.setItem(this.key, JSON.stringify(obj));
		// @ts-ignore
		this.tabs[this.id] = obj;
		this.on_update();
	}

	static init() {
		if (this.is_init) return;
		this.is_init = true;
		window.addEventListener(`storage`, e => {
			if (e.key !== this.key) return;
			const obj = JSON.parse(e.newValue || `{}`);
			if (obj.hasOwnProperty(`remove`)) delete this.tabs[obj.remove];
			else this.tabs[obj.id] = obj;
			this.on_update();
		});

		window.addEventListener(`beforeunload`, () => {
			localStorage.setItem(this.key, JSON.stringify({remove: this.id}));
		});
		document.addEventListener('visibilitychange', () => this.on_visibility_change());
		document.addEventListener("DOMContentLoaded", () => this.on_visibility_change());

	}
}

ActiveTab.init();

console.log(`check`);

export {};