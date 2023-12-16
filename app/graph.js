class AbstractGEvent {

}

class GEvent extends AbstractGEvent {
    constructor(value, multiplier = 1) {
        super();
        this.value = value;

        this.multiplier = multiplier;
    }

    get calc() {
        if (typeof (this.value) === 'number')
            return this.value * this.multiplier;

        return this.value.calc * this.multiplier;
    }
}

class GAnd extends AbstractGEvent {
    constructor(multiplier, ...events) {
        super();
        this.multiplier = multiplier;

        this.events = events;
    }

    get calc() {
        return Math.min(...this.events.map(x => x.calc)) * this.multiplier;
    }
}

class GOr extends AbstractGEvent {
    constructor(multiplier, ...events) {
        super();
        this.multiplier = multiplier;
        this.events = events;
    }

    get calc() {
        return this.events.reduce((x, y) => new GEvent(x.calc + y.calc - x.calc * y.calc, 1)).calc * this.multiplier;
    }
}

let events = [];

window.onload = () => {
    let counter = 0;
    let editable = undefined;

    addEvent.onclick = () => {
        let ev = new eventWrapper(++counter);

        events.push(ev);

        let elem = document.createElement('div');
        elem.append(eventList.querySelector("template").content.cloneNode(true));

        let spans = elem.querySelectorAll('span');

        spans[0].textContent = counter;

        elem.querySelectorAll('button')[1].onclick = () => {
            events = events.filter(x => x !== ev);
            for (let { event } of events) {
                if (event.value == ev.event)
                    event.value = undefined;
                if (event.events)
                    event.events = event.events.filter(x => x != ev.event);
            }
            eventList.removeChild(elem);

            if (editable) getListFor(editable);
        }

        elem.querySelector('button').onclick = () => {
            editable = ev;
            eventEdit.querySelector('[name=id]').textContent = ev.id;
            eventEdit.querySelector('[name=name]').value = ev.name;
            eventEdit.querySelector('[name=p]').value = ev.event.multiplier;
            eventEdit.querySelector('[name=type]').value = ev.type;
            eventEdit.querySelector('[name=isOut]').checked = ev.isOut;

            eventEdit.querySelector('[name=name]').onchange = ({ target: { value } }) => {
                ev.name = value;

                spans[3].textContent = value;
            };

            eventEdit.querySelector('[name=p]').onchange = ({ target: { value } }) => {

                if (value > 1 || value < 0)
                    value = 0;

                ev.event.multiplier = value;

                spans[1].textContent = value;
            };

            eventEdit.querySelector('[name=type]').onchange = ({ target: { value } }) => {
                ev.changeType(value);

                spans[2].textContent = value;

                if (value == 'In')
                    spans[2].classList.add('eventNameIn');
                else spans[2].classList.remove('eventNameIn');

                getListFor(ev);
            };

            eventEdit.querySelector('[name=isOut]').onchange = ({ target: { checked } }) => {
                ev.isOut = checked;

                if (checked)
                    spans[2].classList.add('eventNameOut');
                else spans[2].classList.remove('eventNameOut');
            };

            getListFor(ev);
        }

        eventList.append(elem);
    }

    function eventWrapper(id, type = 'Event', name = '') {
        this.id = id;
        this.type = type;
        this.name = name;
        this.isOut = false;
        this.event = new GEvent(undefined, 1);

        this.changeType = (type) => {
            if (type == this.type)
                return;

            if (!['In', 'Event', 'Or', 'And'].includes(type))
                throw Error('Invalid type');

            this.type = type;

            switch (type) {
                case 'In':
                case 'Event':
                    if (this.event instanceof GEvent)
                        break;
                    this.event = new GEvent(undefined, this.event.multiplier);
                    break;
                case 'And':
                    this.event = new GAnd(this.event.multiplier);
                    break;
                case 'Or':
                    this.event = new GOr(this.event.multiplier);
                    break;
            }
        }
    }

    function recurCheck(ev1, ev2) {
        if (ev2 instanceof GEvent) {
            if (ev2.value == ev1) return true;

            if (ev2.value instanceof AbstractGEvent) return recurCheck(ev1, ev2.value);
        }

        if (ev2 instanceof GOr || ev2 instanceof GAnd) {
            if (ev2.events.includes(ev1))
                return true;

            return [false, ...ev2.events].reduce((x, y) => x || recurCheck(ev1, y));
        }


    }

    function getListFor(ev) {
        let nodelist = [relList.children[0]];

        if (ev.type != 'In')
            nodelist.push(...events.filter(x => !recurCheck(ev.event, x.event) && x != ev && x.type != 'Out').map(x => {
                let res = document.createElement('div');
                res.append(relList.querySelector('template').content.cloneNode(true));

                res.querySelector('[name=id]').textContent = x.id;
                res.querySelector('input').checked = (ev.event.value == x.event || ev.event.events?.includes(x.event));

                res.querySelector('input').onchange = ({ target }) => {
                    if (ev.type == 'In') return;
                    if (ev.type == 'Event') {
                        if (target.checked == false) {
                            ev.event.value = undefined;
                            return;
                        }

                        ev.event.value = x.event;

                        [...relList.querySelectorAll('input')].filter(x => x != target).forEach(element => {
                            element.checked = false;
                        });

                        return;
                    }

                    if (target.checked == false) {
                        ev.event.events = ev.event.events.filter(item => item != x.event);
                        return;
                    }

                    ev.event.events.push(x.event);
                }

                return res;
            }))


        relList.replaceChildren(...nodelist);
    }
}