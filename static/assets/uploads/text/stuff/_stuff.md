# Stuff

For some reason git decides that they don't want to push empty folders.
So I'm adding a markdown file for clarification.

This folder is a demonstration of potential alternate file types.

In this case, text will only accept files with .txt extensions.

Additionally, custom rules can be set inside the config.json file regarding
the extensions allow and (not yet implemented) limits to upload

## Usage

You **MUST** post to /upload/`upload type`/`upload id`.
In this case, you will post to /upload/stuff/`stuff_id`.

The form file input entry **MUST** have the name="file" tag 
(or whatever formFileName is currently set to in config.json `[app/config.json]`).

