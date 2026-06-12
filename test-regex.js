const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
const urls = [
  "https://youtu.be/_Kw6UcPsjp4",
  "https://www.youtube.com/watch?v=HP4K9eQVxsU&list=PLTuuQN_bAwZ4bUuYceiDHUELLU_u6UsyS",
  "https://youtube.com/playlist?list=PLgWzWDJ5fcXkXT1028nVW4HaAJXyjHOEH&si=B8bf8X_WOaPJDgXw"
];
urls.forEach(u => {
  const m = u.match(regex);
  console.log(u, "->", m ? m[1] : "NO MATCH");
});
