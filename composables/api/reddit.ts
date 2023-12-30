export async function getUserInfo(username: string): Promise<Object> {
  const url = `https://www.reddit.com/user/${username}/about.json`;

  const response = await fetch(url);
  return await response.json();
}

export async function getCryptoContactFromId(userId: string): Promise<Object> {
  const url = 'https://corsproxy.io/?' + encodeURIComponent(`https://meta-api.reddit.com/crypto-contacts?providers=ethereum&userIds=t2_${userId}`);

  const response = await fetch(url);
  return await response.json();
}

export async function getCryptoContactFromAddress(address: string): Promise<Object> {
  const url = 'https://corsproxy.io/?' + encodeURIComponent(`https://meta-api.reddit.com/crypto-contacts?providers=ethereum&addresses=${address}`);

  const response = await fetch(url);
  return await response.json();
}
