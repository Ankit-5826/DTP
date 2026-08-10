## Environment Variables

Never commit:

- `.env`
- API keys
- database credentials
- access tokens
- private keys

Use `.env.example` to document required variables without exposing
their actual values.



## Pull Requests

Pull Requests should:

- Have a clear title.
- Explain what changed.
- Explain why the change was needed.
- Include testing information.
- Reference the related GitHub Issue when applicable.

Example:

Closes #15