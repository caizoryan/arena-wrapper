let channelSlug = "bibliography-adh4_c9bfww/";
let blockSlug = "18552858";

let ar = new Arena(channelSlug);

ar.allContent().then((res) => console.log(res));
ar.meta().then((res) => console.log(res.title));
ar.everything().then((res) => console.log(res));
