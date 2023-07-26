import PixivAppApi from 'pixiv-app-api';
const pixiv = new PixivAppApi(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD, {
  camelcaseKeys: true,
});

const load = async () => {
  await pixiv
    .login()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default { load, pixiv };
