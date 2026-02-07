# -*- coding: utf-8 -*-
import zipfile
import xml.etree.ElementTree as ET
import sys

path = r"c:\Labs\Study\курсач и диплом\Файлы\ДИПЛОМ ААААААААА.docx"
ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

with zipfile.ZipFile(path, "r") as z:
    with z.open("word/document.xml") as f:
        tree = ET.parse(f)
        root = tree.getroot()
        for p in root.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"):
            if p.text:
                sys.stdout.write(p.text)
            if p.tail:
                sys.stdout.write(p.tail)
        print()
