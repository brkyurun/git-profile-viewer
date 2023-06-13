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
    try {
      user = await fetchUser(usernameInput.value);
    } catch (error) {
      return Promise.reject(`Failed to fetch the user: ${error}`);
    }
  }

  // the fetchUser function returns null if no user is found
  if (user === null) return;

  if (user.login !== undefined) {
    cache.setValue(user?.login, user);
  }

  updateCard(user);
  const cardContainer = document.getElementById("cardContainer") as HTMLElement; // there is no HTMLSectionElement, bummer :(
  cardContainer.classList.replace("opacity-0", "opacity-100");
});

async function fetchUser(name: string): Promise<GitHubUser | null> {
  if (!name) {
    return Promise.reject("Please provide a valid GitHub username.");
  }

  try {
    const url = `https://api.github.com/users/${name}`;
    const user = await fetch(url, {
      referrer: "no-referrer",
      method: "GET",
    });

    return user.json();
  } catch (error: unknown) {
    return Promise.reject(`An error has occurred: ${error}`);
  }
}

function updateCard(user: GitHubUser): void {
  const cardImage = document.getElementById("cardImg") as HTMLImageElement;
  const cardUserName = document.getElementById(
    "cardUserName"
  ) as HTMLAnchorElement;
  const cardUserBio = document.getElementById(
    "cardUserBio"
  ) as HTMLQuoteElement;
  const cardUserLocation = document.getElementById(
    "cardUserLocation"
  ) as HTMLParagraphElement;
  const cardFollowers = document.getElementById(
    "cardFollowers"
  ) as HTMLParagraphElement;
  const cardFollowersLink =
    cardFollowers.firstElementChild as HTMLAnchorElement;
  const cardFollowing = document.getElementById(
    "cardFollowing"
  ) as HTMLParagraphElement;
  const cardFollowingLink =
    cardFollowing.firstElementChild as HTMLAnchorElement;
  const cardRepositories = document.getElementById(
    "cardRepositories"
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

  // toggle <q> visibility and restore if next user has a bio
  if (user.bio === null) {
    cardUserBio.classList.add("hidden");
  } else {
    cardUserBio.classList.remove("hidden");
  }
}
