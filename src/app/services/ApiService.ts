import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class ApiService {

  constructor(private http:Http) {
  }

  getFile() {
    var url = '';
    url = 'https://docs.google.com/document/d/1K7rh9iKomflEKEs5ApstHQM9vvNV73UIY8j3LA_rcpU/pub';
    url = 'https://www.googleapis.com/drive/v3/files/fileId/export?fileId=1Xxqt2V9gu0ghEMBgVm4xNbEO579Pq8uNXbc5r1OD58I&mimeType=text/html&key=AIzaSyDIzqeDtau8sP6OtsURRSsSjUxDR1Qd1RA';
    return this.http.get(url)
      .map((res:Response) => res.text());
  }

}
