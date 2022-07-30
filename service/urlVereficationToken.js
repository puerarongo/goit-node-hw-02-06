const urlVereficationToken = (token) => { 
    const urlPath = `<a target="_blank" href="http://localhost:3000/api/users/verify/${token}">Click to confirm email</a>`;
    return urlPath;
};

module.exports = urlVereficationToken;