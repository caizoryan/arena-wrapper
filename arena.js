class Arena {
  #url;
  #channel;
  #content = [];
  #fetched = false;
  constructor(channel) {
    this.#url = "https://api.are.na/v2/";
    this.#channel = channel;
    this.#init();
  }

  #init() {
    this.#fetch("channels/", "length").then((res) => this.#getContent(res));
  }

  async #getContent(length) {
    if (length < 100)
      await this.#fetch("channels/", "contents", `?page=0&amp;per=${length}`)
        .then((data) => this.#setContent(data))
        .then(() => (this.#fetched = true));
    else
      for (let i = 0; i < Math.ceil(length / 100); i++)
        await this.#fetch("channels/", "contents", `?page=${i + 1}&amp;per=100`)
          .then((data) => this.#setContent(data))
          .then(() => (this.#fetched = true));
  }

  async #returnContent(length) {
    if (length < 100)
      return this.#fetch(
        "channels/",
        "contents",
        `?page=0&amp;per=${length}`
      ).then((data) => data);
    else {
      let promises = [];
      for (let i = 0; i < Math.ceil(length / 100); i++)
        promises.push(
          this.#fetch("channels/", "contents", `?page=${i + 1}&amp;per=100`)
        );
      return await Promise.all(promises).then((data) => {
        console.log(data.flat());
        return data.flat();
      });
    }
  }

  /** Returns all the content of the channel as a promise.
   * @returns {Promise} Of an array of objects containing all the data of the channel
   */
  async everything() {
    // return all content
    if (!this.#fetched)
      return await this.#fetch("channels/", "length")
        .then((res) => this.#returnContent(res))
        .then((res) => res);
    else {
      return this.#content;
    }
  }

  /** Returns all the blocks that are Texts
   * @returns {Promise} promise of an array objects containing all text blocks
   */
  async texts() {
    return await this.everything().then((res) =>
      res.filter((block) => block.class === "Text")
    );
  }

  /** Returns all the blocks that are Images
   * @returns {Promise} promise of an array objects containing all Image blocks
   */
  async images() {
    return await this.everything().then((res) =>
      res.filter((block) => block.class === "Image")
    );
  }

  /** Returns all the blocks that are Links
   * @returns {Promise} promise of an array objects containing all Link blocks
   */
  async links() {
    return await this.everything().then((res) =>
      res.filter((block) => block.class === "Link")
    );
  }

  /** Returns all the blocks that are Attatchments
   * @returns {Promise} Promise of an array objects containing all attatchments blocks
   */
  async attachments() {
    return await this.everything().then((res) =>
      res.filter((block) => block.class === "Attachment")
    );
  }

  /** Returns all the blocks that are Channels
   * @returns {Promise} Promise of an array objects containing all Channels blocks
   */
  async channel() {
    return await this.everything().then((res) =>
      res.filter((block) => block.class === "Channel")
    );
  }

  /** Returns all the blocks that are titled the given parameter
   * @param {string} Title - Block title
   * @returns {Promise} Promise of an array objects containing all Channels blocks
   */
  async title(required) {
    return await this.everything().then((res) => {
      res.filter((block) => block.title === required);
    });
  }

  // sort() {
  //   // sort content by x, y, z
  // }

  /** Returns all the blocks that are titled the given parameter
   * @param {function} Callback - A callback for the filter, to get filtered array of blocks
   * @returns {Promise} Promise of an array objects containing all Channels blocks
   */
  async customFilter(callback) {
    return await this.everything().then((res) => res.filter(callback));
  }

  /** Returns a block with given id
   * @param {String} slug - Block slug
   */
  async block(id) {
    return await fetch(this.#url + "blocks/" + id).then((response) =>
      response.json()
    );
  }

  #setContent(data) {
    for (const x of data) this.#content.push(x);
  }

  async #fetch(type, attribute = null, request = "") {
    return await fetch(this.#url + type + this.#channel + request)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (attribute) {
          return res[attribute];
        } else {
          return res;
        }
      });
  }
}
