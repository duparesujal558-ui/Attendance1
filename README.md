# Attendance Register v3

One folder, 8 files. Upload them all to GitHub Pages (or any https host)
and open the link on your phone.

## What changed from v2

The old version accumulated patches until the sync layer fought itself.
This is a rewrite around one rule:

> Every record carries an id, a timestamp, and a deleted flag.
> Merging two devices compares records one by one; newest timestamp wins.

That single rule fixes the three bugs that kept coming back:

- **Deletions stick.** Deleting stamps a tombstone instead of removing the
  row, so the other phone learns about it rather than helpfully restoring it.
- **No duplicate classes.** A class is an id, not a name. "TY AIML",
  "ty aiml" and "TY AIML " all resolve to the same record, and renaming
  never splits it in two.
- **Login always asks.** If even one person exists, the app is locked until
  somebody signs in. No tab, button or link gets past it.

## Setting up

1. **Setup tab** → college name → add a class
2. **Bulk add** your students: `Roll, Name, Phone, Division, Batch`
3. **Auto-split** the division into batches
4. Add your subjects and teachers
5. **Save backup file** — do this before anything else goes wrong

## Sharing with other teachers

1. Firebase → console.firebase.google.com → new project (Analytics off)
2. **Databases & Storage → Realtime Database → Create** → Singapore →
   test mode
3. **Rules** tab → replace with:

```json
{ "rules": { "att": { "$code": { ".read": true, ".write": true } } } }
```

Leave `$code` exactly as written — it is a wildcard. **Publish.**

4. In the app: Setup → Share with other teachers → paste the database URL
   and a long random team code → **Test connection**
5. **Copy setup link for other teachers** and send it to them directly

Their phone opens that link and arrives connected, with your classes,
students and logins, asking them to sign in. Nothing to type.

**The team code is the password to your data.** Send the link to teachers
personally, never into a class group.

## Logins

Setup → People & logins. Three roles:

| Role | Can do |
|---|---|
| Owner | Everything, including managing people |
| Teacher | Their assigned class. Leave blank for all classes |
| Class CR | One class, marking only. Never sees parent numbers |

A banner tells you whether login is **ON** or **OFF**, and **Lock now**
shows the login screen immediately so you can check it works.

There is no PIN reset. Keep a backup.

## What never syncs

Parent phone numbers. They stay on the phone that entered them, because
the database has no login and should not hold sixty families' contacts.

To move them, use Setup → Backup → **Transfer to another phone by text**.

## Daily use

- **Morning** — Mark → Full class → Morning → tap A for absentees → Generate
- **Practical** — Mark → Batch 1 → Afternoon → Practical → pick subject → Generate
- **Evening** — Mark → Full class → Evening → Generate

After an evening session the sheet shows two lists: absentees, and anyone
present this morning but absent now. The second group gets a different
message, because leaving campus is not the same as never arriving.

- **Month** — session-wise or day-wise. A half day counts 0.5, so a regular
  mid-day leaver lands near 50%, not 100%.

## Updating

The whole app is `index.html`. Replace that one file and every phone
updates on next open. The version shows in the green bar.
