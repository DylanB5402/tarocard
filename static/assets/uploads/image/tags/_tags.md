# Tags

For some reason git decides that they don't want to push empty folders
So I'm adding a markdown file for clarification

This folder contains all the uploaded files for drink tags (tags).

## Usage

You **MUST** post to /upload/`upload type`/`upload id`
In this case, you will post to /upload/tags/`tag_id`

The form file input entry **MUST** have the name="file" tag 
(or whatever formFileName is currently set to in config.json [app/config.json])

Because the id of the tag might be different, make sure to dynamically change
where the POST address is

*Example Code:*
```html
<!-- this form sends a post to /upload -->
<form id="myform" method="post" enctype="multipart/form-data" action="/upload/tags/1">
  <input type="file" name="file">
  <input type="submit" value="Submit">
</form>
```