import React from 'react';

// Country/calling-code options supplied in the requested country list.
const COUNTRY_OPTIONS = `Afghanistan|93
Albania|355
Algeria|213
American Samoa|1684
Andorra|376
Angola|244
Anguilla|1264
Antarctica|672
Antigua and Barbuda|1268
Argentina|54
Armenia|374
Aruba|297
Australia|61
Austria|43
Azerbaijan|994
Bahamas|1242
Bahrain|973
Bangladesh|880
Barbados|1246
Belarus|375
Belgium|32
Belize|501
Benin|229
Bermuda|1441
Bhutan|975
Bolivia|591
Bosnia and Herzegovina|387
Botswana|267
Brazil|55
British Indian Ocean Territory|246
British Virgin Islands|1284
Brunei|673
Bulgaria|359
Burkina Faso|226
Burundi|257
Cambodia|855
Cameroon|237
Canada|1
Cape Verde|238
Cayman Islands|1345
Central African Republic|236
Chad|235
Chile|56
China|86
Christmas Island|61
Cocos Islands|61
Colombia|57
Comoros|269
Cook Islands|682
Costa Rica|506
Croatia|385
Cuba|53
Curacao|599
Cyprus|357
Czech Republic|420
Democratic Republic of the Congo|243
Denmark|45
Djibouti|253
Dominica|1767
Dominican Republic|1809
East Timor|670
Ecuador|593
Egypt|20
El Salvador|503
Equatorial Guinea|240
Eritrea|291
Estonia|372
Ethiopia|251
Falkland Islands|500
Faroe Islands|298
Fiji|679
Finland|358
France|33
French Polynesia|689
Gabon|241
Gambia|220
Georgia|995
Germany|49
Ghana|233
Gibraltar|350
Greece|30
Greenland|299
Grenada|1473
Guam|1671
Guatemala|502
Guernsey|44-1481
Guinea|224
Guinea-Bissau|245
Guyana|592
Haiti|509
Honduras|504
Hong Kong|852
Hungary|36
Iceland|354
India|91
Indonesia|62
Iran|98
Iraq|964
Ireland|353
Isle of Man|44-1624
Israel|972
Italy|39
Ivory Coast|225
Jamaica|1876
Japan|81
Jersey|44-1534
Jordan|962
Kazakhstan|7
Kenya|254
Kiribati|686
Kosovo|383
Kuwait|965
Kyrgyzstan|996
Laos|856
Latvia|371
Lebanon|961
Lesotho|266
Liberia|231
Libya|218
Liechtenstein|423
Lithuania|370
Luxembourg|352
Macau|853
Macedonia|389
Madagascar|261
Malawi|265
Malaysia|60
Maldives|960
Mali|223
Malta|356
Marshall Islands|692
Mauritania|222
Mauritius|230
Mayotte|262
Mexico|52
Micronesia|691
Moldova|373
Monaco|377
Mongolia|976
Montenegro|382
Montserrat|1664
Morocco|212
Mozambique|258
Myanmar|95
Namibia|264
Nauru|674
Nepal|977
Netherlands|31
Netherlands Antilles|599
New Caledonia|687
New Zealand|64
Nicaragua|505
Niger|227
Nigeria|234
Niue|683
North Korea|850
Northern Mariana Islands|1670
Norway|47
Oman|968
Pakistan|92
Palau|680
Palestine|970
Panama|507
Papua New Guinea|675
Paraguay|595
Peru|51
Philippines|63
Pitcairn|64
Poland|48
Portugal|351
Puerto Rico|1787
Qatar|974
Republic of the Congo|242
Reunion|262
Romania|40
Russia|7
Rwanda|250
Saint Barthelemy|590
Saint Helena|290
Saint Kitts and Nevis|1869
Saint Lucia|1758
Saint Martin|590
Saint Pierre and Miquelon|508
Saint Vincent and the Grenadines|1784
Samoa|685
San Marino|378
Sao Tome and Principe|239
Saudi Arabia|966
Senegal|221
Serbia|381
Seychelles|248
Sierra Leone|232
Singapore|65
Sint Maarten|1721
Slovakia|421
Slovenia|386
Solomon Islands|677
Somalia|252
South Africa|27
South Korea|82
South Sudan|211
Spain|34
Sri Lanka|94
Sudan|249
Suriname|597
Svalbard and Jan Mayen|47
Swaziland|268
Sweden|46
Switzerland|41
Syria|963
Taiwan|886
Tajikistan|992
Tanzania|255
Thailand|66
Togo|228
Tokelau|690
Tonga|676
Trinidad and Tobago|1868
Tunisia|216
Turkey|90
Turkmenistan|993
Turks and Caicos Islands|1649
Tuvalu|688
U.S. Virgin Islands|1340
Uganda|256
Ukraine|380
United Arab Emirates|971
United Kingdom|44
United States|1
Uruguay|598
Uzbekistan|998
Vanuatu|678
Vatican|379
Venezuela|58
Vietnam|84
Wallis and Futuna|681
Western Sahara|212
Yemen|967
Zambia|260
Zimbabwe|263`
  .split('\n')
  .map(line => {
    const [name, code] = line.split('|');
    return { name, code };
  });

export default function CountryPhoneField({
  label,
  value,
  onChange,
  countryName = 'India',
  countryCode = '91',
  onCountryChange,
  placeholder = '98765 43210',
  required = false,
}) {
  const selected = COUNTRY_OPTIONS.find(c => c.name === countryName && c.code === countryCode)
    || COUNTRY_OPTIONS.find(c => c.name === countryName)
    || COUNTRY_OPTIONS.find(c => c.code === countryCode)
    || COUNTRY_OPTIONS.find(c => c.name === 'India');

  const handleCountry = event => {
    const next = COUNTRY_OPTIONS.find(c => c.name === event.target.value);
    if (next) onCountryChange?.(next);
  };

  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-1">{label}{required ? ' *' : ''}</span>
      <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(120px,1fr)] gap-2">
        <select
          value={selected?.name || 'India'}
          onChange={handleCountry}
          className="w-full min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
          aria-label={`${label} country`}
        >
          {COUNTRY_OPTIONS.map(country => (
            <option key={`${country.name}-${country.code}`} value={country.name}>
              {country.name} (+{country.code})
            </option>
          ))}
        </select>
        <div className="flex min-w-0">
          <span className="flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-sm font-bold text-slate-600 whitespace-nowrap">+{selected?.code || countryCode}</span>
          <input
            required={required}
            type="tel"
            inputMode="tel"
            value={value ?? ''}
            onChange={e => onChange?.(e.target.value)}
            className="w-full min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-indigo-500"
            placeholder={placeholder}
            aria-label={`${label} number`}
          />
        </div>
      </div>
      <span className="block mt-1 text-[11px] text-slate-400">Country: {selected?.name} · Calling code: +{selected?.code}</span>
    </label>
  );
}

export { COUNTRY_OPTIONS };