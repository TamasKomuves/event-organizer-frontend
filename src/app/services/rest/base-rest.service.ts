import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class BaseRestService {
  // SERVER_BASE_URL = 'https://powerful-shelf-66888.herokuapp.com/';
  SERVER_BASE_URL = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) {}

  getMethod<T>(url: string) {
    return this.httpClient.get<T>(this.SERVER_BASE_URL + url, {
      headers: new HttpHeaders().set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  postMethod<T>(url: string, body: any) {
    return this.httpClient.post<T>(this.SERVER_BASE_URL + url, body, {
      headers: new HttpHeaders()
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  deleteMethod(url: string) {
    return this.httpClient.delete(this.SERVER_BASE_URL + url, {
      headers: new HttpHeaders().set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  putMethod<T>(url: string, body: any) {
    return this.httpClient.put<T>(this.SERVER_BASE_URL + url, body, {
      headers: new HttpHeaders()
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  postMethodWithoutAuth(url: string, body: any) {
    return this.httpClient.post(this.SERVER_BASE_URL + url, body, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }
}
