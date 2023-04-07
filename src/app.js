import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const profile = [
  {
    username: "bobesponja",
    avatar:
      "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png",
  },
];
const tweets = [];

app.post("/sign-up", (request, response) => {
  const { username, avatar } = request.body;

  if (
    typeof username != "string" ||
    typeof avatar != "string" ||
    !username ||
    !avatar
  ) {
    response.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  const newUser = { username, avatar };

  profile.push(newUser);
  response.status(201).send("OK");
});

app.post("/tweets", (request, response) => {
  const { user } = request.headers;
  const { username, tweet } = request.body;

  const findUsername = profile.find(
    (name) => name.username === user || name.username === username
  );

  if (!findUsername) {
    response.status(401).send("UNAUTHORIZED");
    return;
  }

  if (
    typeof username != "string" ||
    typeof tweet != "string" ||
    !username ||
    !tweet
  ) {
    response.status(400).send("Todos os campos são obrigatórios");
    return;
  }

  const newTweet = { username, tweet };

  tweets.push(newTweet);
  response.status(201).send("OK");
});

app.get("/tweets", (request, response) => {
  const { page } = request.query;
  const pageSize = 10;

  if (page && page < 1) {
    response.status(400).send("Informe uma página válida!");
    return;
  }

  const startIndex = page ? (page - 1) * pageSize : 0;
  const endIndex = startIndex + pageSize;

  const withTen = tweets.slice(startIndex, endIndex).reverse();

  const tweetsWithAvatars = withTen.map((t) => {
    const { username, tweet } = t;

    const findAvatar = profile.find((a) => a.username === t.username);
    const avatar = findAvatar ? findAvatar.avatar : null;

    return { username, avatar, tweet };
  });

  response.send(tweetsWithAvatars);
});

app.get("/tweets/:USERNAME", (request, response) => {
  const { USERNAME } = request.params;

  const userTweets = tweets.filter((t) => t.username === USERNAME);

  const tweetsWithAvatars = userTweets.map((t) => {
    const { username, tweet } = t;

    const findAvatar = profile.find((a) => a.username === t.username);
    const avatar = findAvatar ? findAvatar.avatar : null;
    return { username, avatar, tweet };
  });

  response.send(tweetsWithAvatars);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
