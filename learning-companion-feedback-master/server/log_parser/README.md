# Log parser

- Get logs by executing `find . -type f -exec ls -1rt "{}" + | xargs cat` in the logs folder
- Place them in the log file
- Execute `python parse.py`
