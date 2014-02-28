# jspot

Extracts gettext strings from Javascript files into pot files.

```
$ jspot extract file.js -k _
```

```javascript
_('foo');
_.ngettext('bar', 'bars');
```

## How to install

```
# npm install -g jspot
```

## Usage

```
$ jspot --help              

Usage: jspot <command>

command     
  extract     Extract source from javascript files into pot files

$ jspot extract --help

Usage: jspot extract <source>... [options]

source     The source files to extract from.

Options:
   -t DIR, --target DIR      Directory to write pot files to.  [.]
   -k WORD, --keyword WORD   Keyword to search for in source  [gettext]
   --header NAME:VALUE       Set a header for the written pot files

Extract source from javascript files into pot files
```
