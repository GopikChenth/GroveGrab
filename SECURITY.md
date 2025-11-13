# 🔐 Security Guidelines for GroveGrab

## Important: Protecting Your Spotify API Credentials

Your Spotify API credentials (`Client ID` and `Client Secret`) are sensitive and should be treated like passwords.

## ⚠️ Before Committing to Git

### 1. Check for Exposed Credentials

Run this command to search for any accidentally committed credentials:

```powershell
# Search for common credential patterns (replace with your actual values)
git grep -i "client_id" 
git grep -i "client_secret"
```

### 2. Verify .gitignore

Make sure these entries are in your `.gitignore`:

```gitignore
# Environment files with secrets
.env
.env.local
Backend/.env
Backend/config.json
Client/.env

# Build outputs that may contain embedded secrets
dist/
Distribution/
Client/dist/
build/
```

### 3. Never Commit These Files

❌ **NEVER commit:**
- `Backend/.env` (contains real credentials)
- `Backend/config.json` (stores user-configured credentials)
- Any built/packaged files (`Client/dist/`, `Distribution/`)
- Any files with actual API keys

✅ **Safe to commit:**
- `Backend/.env.template` (placeholder values only)
- `Backend/.env.example` (placeholder values only)
- Source code files
- Configuration templates
- Documentation

## 🔄 If You've Already Committed Secrets

If you accidentally committed secrets to git history, you MUST:

### 1. Rotate Your Credentials Immediately

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Find your app
3. Go to Settings
4. Click "View client secret" → "Reset client secret"
5. Copy your new credentials
6. Update your local `Backend/.env` file

### 2. Remove Secrets from Git History

**Option A: Using git-filter-repo (Recommended)**

```powershell
# Install git-filter-repo
pip install git-filter-repo

# Create a replacements file
@"
a3f828ab10ba4bfaa63a720b06fdb744==>REMOVED_CLIENT_ID
2b3165ca747b4122a074a8b1fc7d2f00==>REMOVED_CLIENT_SECRET
"@ | Out-File -Encoding UTF8 replacements.txt

# Run the filter (CAUTION: This rewrites history!)
git filter-repo --replace-text replacements.txt

# Force push to remote (coordinate with team first!)
git push origin --force --all
git push origin --force --tags
```

**Option B: Using BFG Repo-Cleaner**

```powershell
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/YourUsername/GroveGrab.git

# Run BFG
java -jar bfg.jar --replace-text replacements.txt GroveGrab.git

# Clean up and push
cd GroveGrab.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### 3. Notify Collaborators

After rewriting history, all collaborators must:

```powershell
# Delete their local repo
cd ..
Remove-Item -Recurse -Force GroveGrab

# Re-clone fresh
git clone https://github.com/YourUsername/GroveGrab.git
```

## 📋 Pre-Commit Checklist

Before every commit, verify:

- [ ] No `.env` files staged for commit
- [ ] No `config.json` files with real credentials
- [ ] No built/dist directories with embedded secrets
- [ ] No hardcoded API keys in source code
- [ ] `.gitignore` is up to date
- [ ] Only template/example files with placeholders

Run this quick check:

```powershell
# See what you're about to commit
git status
git diff --cached

# Search staged files for potential secrets
git diff --cached | Select-String -Pattern "client_id|client_secret|SPOTIFY_CLIENT"
```

## 🛡️ Best Practices

### For Developers

1. **Use Environment Variables**: Never hardcode credentials in source code
2. **Use Templates**: Provide `.env.template` with placeholder values
3. **Document Setup**: Clearly explain how to create `.env` from template
4. **Review PRs**: Check that no credentials are in pull requests
5. **Rotate Regularly**: Change credentials periodically

### For Users

1. **Keep `.env` Private**: Never share your `.env` file
2. **Don't Screenshot**: Avoid sharing screenshots with visible credentials
3. **Use Different Credentials**: Don't reuse Spotify credentials across projects
4. **Monitor Usage**: Check Spotify dashboard for unexpected API usage
5. **Revoke Unused Apps**: Remove apps you're not using from Spotify dashboard

## 🔍 Detecting Leaked Credentials

If you suspect your credentials were exposed:

1. **Check git history**:
   ```powershell
   git log -p -S "client_secret" --all
   ```

2. **Check GitHub**: Search your repository on GitHub for the strings

3. **Rotate immediately**: Don't wait - rotate your credentials NOW

4. **Monitor usage**: Check Spotify dashboard for unexpected activity

## 📞 Getting Help

If you need help with security issues:

1. Do NOT post your actual credentials anywhere
2. Rotate your credentials first
3. Then ask for help with sanitizing git history
4. Use placeholder values in any examples

## 🎯 Quick Recovery Steps

If you just committed secrets:

```powershell
# If you haven't pushed yet:
git reset --soft HEAD~1  # Undo the commit
git reset Backend/.env   # Unstage the .env file
git commit -m "Your safe changes"

# If you already pushed:
# 1. Rotate credentials in Spotify Dashboard
# 2. Fix the commit
# 3. Force push (if you're the only user)
git commit --amend
git push --force

# Or rewrite history as described above
```

## 📚 Additional Resources

- [Spotify API Best Practices](https://developer.spotify.com/documentation/general/guides/authorization-guide/)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [git-filter-repo Documentation](https://github.com/newren/git-filter-repo)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

**Remember**: Prevention is easier than cleanup. Always double-check before committing!
