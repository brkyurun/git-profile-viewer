import "./style.css";
import { QueryCache } from "./utils";
import { GitHubUser } from "./types";

const cache = new QueryCache<string, GitHubUser>();

const usernameInput = document.querySelector(
  'input[name="githubName"]'
) as HTMLInputElement;
const submitButton = document.querySelector(
  'button[type="submit"]'
) as HTMLButtonElement;

submitButton.addEventListener("click", async (e: MouseEvent): Promise<void> => {
  e.preventDefault();
  let user: GitHubUser | undefined | null = cache.getValue(usernameInput.value);

  if (user === undefined) {
    user = await fetchUser(usernameInput.value);
  }

  // the fetchUser function returns null if no user is found
  if (user === null) {
    throw new Error("User not found.");
  }

  if (user.login !== undefined) {
    cache.setValue(user?.login as string, user as GitHubUser);
  }

  updateCard(user as GitHubUser);
  const cardContainer = document.querySelector(
    "section#cardContainer"
  ) as HTMLElement; // there is no HTMLSectionElement, bummer :(
  cardContainer.classList.replace("opacity-0", "opacity-100");
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

function updateCard(user: GitHubUser): void {
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
  const cardFollowersLink =
    cardFollowers.firstElementChild as HTMLAnchorElement;
  const cardFollowing = document.querySelector(
    "p#cardFollowing"
  ) as HTMLParagraphElement;
  const cardFollowingLink =
    cardFollowing.firstElementChild as HTMLAnchorElement;
  const cardRepositories = document.querySelector(
    "p#cardRepositories"
  ) as HTMLParagraphElement;
  const cardRepositoriesLink =
    cardRepositories.firstElementChild as HTMLAnchorElement;

  cardImage.src = user.avatar_url ?? null;
  cardImage.alt = `Profile photo of ${user.login}`;

  cardUserName.innerText = `${user.name} (${user.login})`;
  cardUserName.href = user.html_url;
  cardUserBio.innerText = user.bio ?? "";
  cardUserBio.cite = user.name;
  cardUserLocation.innerHTML = `from <span class="text-neutral-100">${user.location}</span>`;

  cardFollowersLink.innerText = user.followers?.toString() ?? "0";
  cardFollowersLink.href = user.followers_url;
  cardFollowingLink.innerText = user.following?.toString() ?? "0";
  cardFollowingLink.href = user.following_url;
  cardRepositoriesLink.innerText = user.public_repos?.toString() ?? "0";
  cardRepositoriesLink.href = user.repos_url;
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
