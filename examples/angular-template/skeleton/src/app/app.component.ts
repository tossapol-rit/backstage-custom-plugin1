import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '${{ values.name }}';
  description = '${{ values.description }}';
  angularVersion = '${{ values.angularVersion }}';
  {% if values.database != 'none' -%}
  database = '${{ values.database }}';
  {%- endif %}
  {% if values.enableVault -%}
  vaultEnabled = true;
  {%- endif %}
}
