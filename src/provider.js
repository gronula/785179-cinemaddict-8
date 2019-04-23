import ModelCard from "./model-card";

const objectToArray = (object) => Object.keys(object).map((id) => object[id]);

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  getCards() {
    if (this._isOnline()) {
      return this._api.getCards()
        .then((cards) => {
          cards.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
          return cards;
        });
    } else {
      const rawCardsMap = this._store.getAll();
      const rawCards = objectToArray(rawCardsMap);
      const cards = ModelCard.parseCards(rawCards);

      return Promise.resolve(cards);
    }
  }

  updateCard({id, data}) {
    if (this._isOnline()) {
      return this._api.updateCard({id, data})
        .then((card) => {
          this._store.setItem({key: card.id, item: card.toRAW()});
          return card;
        });
    } else {
      const card = data;
      this._needSync = true;
      this._store.setItem({key: card.id, item: card});
      return Promise.resolve(ModelCard.parseCard(card));
    }
  }

  syncCards() {
    return this._api.syncCards({cards: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
