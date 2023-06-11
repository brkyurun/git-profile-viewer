import "./style.css";

interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number | null;
  public_gists: number | null;
  followers: number | null;
  following: number | null;
  created_at: string;
  updated_at: string;
}

const usernameInput = document.querySelector(
  'input[name="github-name"]'
) as HTMLInputElement;
const submitButton = document.querySelector(
  'button[type="submit"]'
) as HTMLButtonElement;
submitButton.addEventListener("click", async (e: MouseEvent) => {
  e.preventDefault();

  const user: GitHubUser | null = await fetchUser(usernameInput.value);

  if (typeof user === null) {
    throw new Error("User not found.");
  }

  updateCard(user as GitHubUser);
  const cardContainer = document.querySelector(
    "section#cardContainer"
  ) as HTMLElement; // there is no HTMLSectionElement, bummer :(
  cardContainer.classList.remove("hidden");
});

async function fetchUser(name: string): Promise<GitHubUser | null> {
  if (!name) {
    throw new Error("Please provide an existing GitHub username.");
  }

  try {
    const url = `https://api.github.com/users/${name}`;
    const user = await fetch(url, {
      referrer: "no-referrer",
      method: "GET",
    });

    return user.json();
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
}

function updateCard(user: GitHubUser) {
  const cardImage = document.querySelector("img#cardImg") as HTMLImageElement;
  const cardUserName = document.querySelector(
    "a#cardUserName"
  ) as HTMLAnchorElement;
  const cardUserBio = document.querySelector(
    "q#cardUserBio"
  ) as HTMLQuoteElement;
  const cardUserLocation = document.querySelector(
    "p#cardUserLocation"
  ) as HTMLParagraphElement;
  const cardFollowers = document.querySelector(
    "p#cardFollowers"
  ) as HTMLParagraphElement;
  const cardFollowersSpan = cardFollowers.firstElementChild as HTMLSpanElement;
  const cardFollowing = document.querySelector(
    "p#cardFollowing"
  ) as HTMLParagraphElement;
  const cardFollowingSpan = cardFollowing.firstElementChild as HTMLSpanElement;
  const cardRepositories = document.querySelector(
    "p#cardRepositories"
  ) as HTMLParagraphElement;
  const cardRepositoriesSpan =
    cardRepositories.firstElementChild as HTMLSpanElement;

  cardImage.src = user.avatar_url ?? null;
  cardImage.alt = `Profile photo of ${user.login}`;

  cardUserName.innerText = `${user.name} (${user.login})`;
  cardUserName.href = user.html_url;
  cardUserBio.innerText = user.bio ?? "";
  cardUserBio.cite = user.name;
  cardUserLocation.innerHTML = `from <span class="text-neutral-100">${user.location}</span>`;

  cardFollowersSpan.innerText = user.followers?.toString() ?? "0";
  cardFollowingSpan.innerText = user.following?.toString() ?? "0";
  cardRepositoriesSpan.innerText = user.public_repos?.toString() ?? "0";
  cardFollowers.classList.remove("hidden");
  cardFollowing.classList.remove("hidden");
  cardRepositories.classList.remove("hidden");

  // remove <q> visibility and restore if next user has a bio
  if (user.bio === null) {
    cardUserBio.classList.add("hidden");
  } else {
    cardUserBio.classList.remove("hidden");
  }
}

const user: GitHubUser | null = await fetchUser("brkyurun");

if (typeof user === null) {
  throw new Error("User not found.");
}

// updateCard(user as GitHubUser);
