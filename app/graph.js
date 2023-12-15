class GEvent {
    constructor(value, multiplier = 1) {
        this.value = value;

        this.multiplier = multiplier;
    }

    get calc() {
        if (typeof (this.value) === 'number')
            return this.value * this.multiplier;

        return this.value.calc * this.multiplier;
    }
}

class GAnd {
    constructor(multiplier, ...events) {
        this.multiplier = multiplier;

        this.events = events;
    }

    get calc() {
        return Math.min(...this.events.map(x => x.calc)) * this.multiplier;
    }
}

class GOr {
    constructor(...events) {
        this.events = events;
    }

    get calc() {
        return this.events.reduce((x, y) => new GEvent(x.calc + y.calc - x.calc * y.calc, 1)).calc;
    }
}

let events = [];
let counter = 0;

window.onload = () => {
    addEvent.onclick = () => {
        let ev = new GEvent(0, 0);

        ev.id = ++counter;

        events.push(ev);

        let elem = document.createElement('div');
        elem.append(document.querySelector("#eventList>template").content.cloneNode(true));

        let spans = elem.querySelectorAll('span');

        spans[0].textContent = counter;

        elem.querySelectorAll('button')[1].onclick = () => {
            events = events.filter(x => x !== ev);
            eventList.removeChild(elem);
        }

        elem.querySelector('button').onclick = () => {

        }

        eventList.append(elem);
    }
}