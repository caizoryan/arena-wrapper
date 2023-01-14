let channelSlug = "gd1-project2process/";
let blockSlug = "18552858";

let ar = new Arena(channelSlug);

// get all the blocks that are images from the channel
ar.images().then((res) => console.log(res));

// get all connected attachments from the channel
ar.attachments().then((res) => console.log(res));

// get all connected channels from the channel
ar.channel().then((res) => console.log(res));

// gett all connected texts from the channel
ar.texts().then((res) => console.log(res));

// custom filter what you need, example to get the first 5 blocks of channel
ar.customFilter((block) => block.position <= 5).then((res) => console.log(res));

// get any block from any channel if you have an id
ar.block(blockSlug).then((res) => console.log(res));

// example use to get all content from all the channels connected to a single channel
let channels = [];

ar.channel()
  .then((res) => {
    for (const x of res) channels.push(new Arena(x.slug));
  })
  .then(() => {
    for (const x of channels) x.everything().then((res) => console.log(res));
  });
