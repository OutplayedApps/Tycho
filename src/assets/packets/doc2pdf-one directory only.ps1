$documents_path = 'C:\Users\arama\git\tycho2\tycho\src\assets\packets\hs\2015 Maryland Fall'

$word_app = New-Object -ComObject Word.Application

# This filter will find .doc as well as .docx documents
Get-ChildItem -Path $documents_path -Filter *.doc? | ForEach-Object {

    $document = $word_app.Documents.Open($_.FullName)

    $pdf_filename = "$($_.DirectoryName)\$($_.BaseName).pdf"
    echo $pdf_filename

    $document.SaveAs([ref] $pdf_filename, [ref] 17)

    $document.Close()
}

$word_app.Quit()