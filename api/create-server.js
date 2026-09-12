export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { serverName, keepInventory } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Vercelの環境変数に登録するアクセストークン
  const REPO_OWNER = 'あなたのGitHubユーザー名';
  const REPO_NAME = 'あなたのリポジトリ名';

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/server.yml/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          server_name: serverName,
          keep_inventory: keepInventory
        }
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errText = await response.text();
      return res.status(500).json({ success: false, error: errText });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
