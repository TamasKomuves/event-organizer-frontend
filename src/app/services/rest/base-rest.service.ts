import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export abstract class BaseRestService {
  constructor(private httpClient: HttpClient) {}

  getMethod<T>(url: string) {
    return this.httpClient.get<T>(environment.apiUrl + url, {
      headers: new HttpHeaders().set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  postMethod<T>(url: string, body: any) {
    return this.httpClient.post<T>(environment.apiUrl + url, body, {
      headers: new HttpHeaders()
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  deleteMethod(url: string) {
    return this.httpClient.delete(environment.apiUrl + url, {
      headers: new HttpHeaders().set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  putMethod<T>(url: string, body: any) {
    return this.httpClient.put<T>(environment.apiUrl + url, body, {
      headers: new HttpHeaders()
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + sessionStorage.getItem('token'))
    });
  }

  postMethodWithoutAuth(url: string, body: any) {
    return this.httpClient.post(environment.apiUrl + url, body, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }
}
