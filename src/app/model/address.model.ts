export interface Address {
  id?: number;
  wardCode?: number;
  ward?: string;
  districtCode?: number;
  district?: string;
  provinceCode?: number;
  province?: string;
  detail?: string;
  status?: number;
}
export interface Province {
  name?: string;
  code?: number;
  codename?: string;
  division_type?: string;
  phone_code?: number;
  districts?: District[];
}
export interface District {
  name?: string;
  code?: number;
  codename?: string;
  division_type?: string;
  short_codename?: string;
  wards?: Ward[];
}
export interface Ward {
  name?: string;
  code?: number;
  codename?: string;
  division_type?: string;
  short_codename?: string;
}
