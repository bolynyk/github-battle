const id = 'YOUR_CLIENT_ID';
const sec = 'YOUR_SECRET_ID';
const params = `?client_id=${id}&client_secret=${sec}`;

function getErrorMessage(message, username) {
    if (message === 'Not Found') {
        return `${username} doesn't exist`;
    }

    return message;
}

function getProfile(username) {
    return fetch(`https://api.github.com/users/${username}${params}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                throw new Error(getErrorMessage(data.message, username));
            }
            return data;
        });
}

function getRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                throw new Error(getErrorMessage(data.message, username))
            }
            return data;
        });
}

function getStarCount(repos) {
    return repos.reduce((count, repo) => {
        const {stargazers_count} = repo;
        return count + stargazers_count;
    }, 0);
}

function calculateScore(followers, repos) {
    return (followers * 3) + getStarCount(repos);
}

function getUserData(player) {
    return Promise.all([
        getProfile(player),
        getRepos(player)
    ]).then(([ profile, repos ]) => {
        const {followers} = profile;
        return ({
            profile: profile,
            score: calculateScore(followers, repos)
        });
    });
}

function sortPlayers(players) {
    return players.sort((a, b) => b.score - a.score);
}

export function battle(players) {
    return Promise.all([
        getUserData(players[0]),
        getUserData(players[1])
    ]).then((results) => sortPlayers(results));
}

export function fetchPopularRepos(language) {
    const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

    return fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            if (!data.items) {
                throw new Error(data.message);
            } else {
                return data.items;
            }
        });
}