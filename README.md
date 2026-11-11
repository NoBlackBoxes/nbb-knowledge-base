# NBB Knowledge Base

Course concepts and practical guides for No Black Boxes. The documentation is written in Markdown and built with [Zensical](https://zensical.org/).

## Contribute

- Add or edit pages under `docs/concepts/` or `docs/practical/`.
- Update `nav` in `zensical.toml` when adding a page.
- To add an author, register their ID, display name, and external profile URL under `[project.extra.authors]` in `zensical.toml`, then use that ID in the page front matter (for example, `author: viktor`). The page template uses this entry for the linked byline.
- Keep the source notes in the separate note vault unchanged unless you intend to edit them there too.

## Local preview and build

Create and activate a Python virtual environment, then install Zensical:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install zensical
```

Preview the site at <http://127.0.0.1:8000/> or build it to `site/`:

```bash
zensical serve
zensical build --clean
```

`site/` is generated output; edit the Markdown and configuration, not the built files.

## GitHub Pages

The workflow in `.github/workflows/docs.yml` builds and deploys on pushes to `main` or `master`. In the repository's Pages settings, choose **GitHub Actions** as the deployment source. Set `site_url` in `zensical.toml` to the actual published URL before deployment.
