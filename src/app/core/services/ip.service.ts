import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpService {
  constructor(private http: HttpClient) { }

  getIpAddress(): Observable<string> {
    return this.http.get<{ip: string}>('https://api.ipify.org?format=json')
      .pipe(
        map(response => response.ip) // This converts the {ip: "..."} object into just the string
      );
  }
}