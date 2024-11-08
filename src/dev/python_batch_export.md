# python 实现批量导出PDF

## 需求

需要实现大量word、excel文件的pdf转换操作，为了保证转换质量，优先考虑用office原生接口。要求目标机器安装有office软件。

## 环境

- python27 (arcgis 自带)
- pip
- pywin32
- pyinstaller

## 环境变量

将python路径 C:\Python27\ArcGIS10.3， C:\Python27\ArcGIS10.3\Scripts  添加到系统path变量中。


## 模块安装

安装pywin32

```shell
pip install pywin32
```

安装pyinstaller

```
pip install pyinstaller
```

## 代码实现

```python
# -- coding: utf-8 --
from win32com.client import Dispatch
import os

wdFormatPDF = 17

# word转换
def doc2pdf(input_file, pdf_file):
    word = Dispatch('Word.Application')
    try:
        doc = word.Documents.Open(input_file, ReadOnly=1)
        doc.SaveAs(pdf_file, FileFormat=wdFormatPDF)
        doc.Close()
        print 'SUCCESS:' + pdf_file
    except:
        print 'ERROR:' + pdf_file
    finally:
        word.Quit()

# 遍历文件（含子文件夹）
def get_filelist(dir, Filelist):
    newDir = dir
    if os.path.isfile(dir):
        Filelist.append(dir)
    elif os.path.isdir(dir):
        for s in os.listdir(dir):
            newDir = os.path.join(dir, s)
            get_filelist(newDir, Filelist)
    return Filelist


print "-----by liuzumou|seehence|2020-----"
print "-----thank you for use-----"

file_path = raw_input("set directory,default use current: ")
if file_path.strip() == "":
    file_path = os.getcwd()
if not file_path.endswith("\\"):
    file_path = file_path + "\\"

file_list = get_filelist(file_path, [])

for file in file_list:
    if file.endswith('.doc') or file.endswith(".docx"):
        pdf_name = file.split(".")[0] + ".pdf"
        if os.path.exists(pdf_name):
            print "INFO:" + pdf_name + " aready exist!"
            continue
        try:
            doc2pdf(file, pdf_name)
        except Exception, err:
            print Exception
            print err

print "finished,thank you for use, press any key to exit"
raw_input()
```

excel转换类似：

```python
from win32com.client import DispatchEx

def xls2pdf(input_file, pdf_file):
    xlApp = DispatchEx("Excel.Application")
    xlApp.Visible = False
    xlApp.DisplayAlerts = 0
    try:
        books = xlApp.Workbooks.Open(input_file, False)
        books.ExportAsFixedFormat(0, pdf_file)
        books.Close(False)
        print 'SUCCESS:' + pdf_file
    except:
        print 'ERROR:' + pdf_file
    finally:
        xlApp.Quit()
```



## 项目打包

```shell
pyinstaller -F -i pdf.ico xls2pdf.py
```

其中 -F 标识生成单个exe文件，-i 为应用程序图标