import ModelTask from "./model-card";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => response.json();

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    document.querySelector(`.films-list  .films-list__container`).textContent = `Loading movies...`;
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelTask.parseTasks);
  }

  createTask(task) {
    return this._load({
      url: `movies`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({[`Content-Type`]: `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  updateTask({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  deleteTask(id) {
    return this._load({url: `movies/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        document.querySelector(`.films-list  .films-list__container`).textContent = `Something went wrong while loading movies. Check your connection or try again later`;
        throw err;
      });
  }
}
