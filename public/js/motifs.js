const motifs = [
"ab",
"abd-A",
"Abd-B",
"ac",
"achi",
"acj6",
"Adf1",
"Aef1",
"al",
"amos",
"Antp",
"aop",
"ap",
"ara",
"Asciz",
"ase",
"Atf-2",
"Atf6",
"ato",
"Awh",
"B-H1",
"B-H2",
"bab1",
"bap",
"bcd",
"BEAF-32",
"Bgb",
"bigmax",
"bin",
"Blimp-1",
"bowl",
"br",
"brk",
"brwl",
"bsh",
"btd",
"btn",
"byn",
"C15",
"cad",
"cato",
"caup",
"Cf2",
"CG10904",
"CG11085",
"CG11294",
"CG11504",
"CG11617",
"CG12155",
"CG12236",
"CG12605",
"CG12768",
"CG15601",
"CG15696",
"CG18599",
"CG3065",
"CG31782",
"CG32105",
"CG32532",
"CG33557",
"CG34031",
"CG3407",
"CG3919",
"CG42741",
"CG4328",
"CG4360",
"CG4404",
"CG4854",
"CG5180",
"CG5953",
"CG6276",
"CG7368",
"CG7386",
"CG7745",
"CG8281",
"CG8319",
"CG8765",
"CG9876",
"ci",
"cic",
"Clk",
"cnc",
"Coop",
"crc",
"CrebA",
"crol",
"crp",
"ct",
"CTCF",
"cwo",
"cyc",
"D",
"D19A",
"D19B",
"da",
"danr",
"dar1",
"Dbx",
"Deaf1",
"Dfd",
"dimm",
"disco",
"disco-r",
"dl",
"Dlip3",
"Dll",
"dmrt99B",
"Doc2",
"dpn",
"Dr",
"Dref",
"dsf",
"dsx",
"dve",
"Dys",
"E(spl)",
"E(spl)m3-HLH",
"E(spl)m5-HLH",
"E(spl)m7-HLH",
"E(spl)mbeta-HLH",
"E(spl)mdelta-HLH",
"E(spl)mgamma-HLH",
"E2f",
"E5",
"EcR",
"eg",
"Eip74EF",
"Eip75B",
"Eip78C",
"Eip93F",
"ems",
"en",
"erm",
"ERR",
"esg",
"Ets21C",
"Ets65A",
"Ets96B",
"Ets97D",
"Ets98B",
"eve",
"exd",
"exex",
"Fer1",
"Fer2",
"Fer3",
"fkh",
"FoxL1",
"foxo",
"FoxP",
"fru",
"ftz",
"ftz-f1",
"GATAd",
"GATAe",
"gcm2",
"gl",
"grh",
"Gsc",
"gt",
"h",
"H2.0",
"Hand",
"hb",
"hbn",
"her",
"Her",
"Hey",
"HGTX",
"HHEX",
"hkb",
"HLH4C",
"HLH54F",
"Hmx",
"Hnf4",
"hng1",
"hng3",
"Hr3",
"Hr4",
"Hr51",
"Hr78",
"Hr83",
"Hsf",
"hth",
"ind",
"inv",
"Irbp18",
"jigr1",
"jim",
"Jra",
"Kah",
"kay",
"ken",
"Klf15",
"klu",
"kni",
"knrl",
"Kr",
"l(1)sc",
"l(3)neo38",
"lab",
"lbe",
"lbl",
"Lim1",
"Lim3",
"lmd",
"lms",
"Lmx1a",
"lola",
"luna",
"Mad",
"mamo",
"Max",
"Med",
"Mef2",
"Mes2",
"Met",
"mio",
"mirr",
"Mitf",
"Mnt",
"Myb",
"Myc",
"nau",
"net",
"NK7.1",
"nub",
"oc",
"odd",
"OdsH",
"Oli",
"onecut",
"opa",
"Optix",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"other_species",
"otp",
"ovo",
"pad",
"pan",
"pb",
"pdm3",
"peb",
"Pfk",
"PHDP",
"pho",
"phol",
"pnr",
"pnt",
"Poxm",
"Poxn",
"Pph13",
"Ptx1",
"repo",
"retn",
"rib",
"rn",
"ro",
"run",
"Rx",
"sage",
"sc",
"schlank",
"Scr",
"scrt",
"sd",
"sens",
"sens-2",
"shn",
"side",
"sim",
"sima",
"Six4",
"slbo",
"slou",
"slp1",
"slp2",
"sna",
"so",
"sob",
"Sox14",
"Sox15",
"Sp1",
"Spps",
"sqz",
"sr",
"srp",
"ss",
"Stat92E",
"Su(H)",
"SU(HW)",
"sug",
"sv",
"svp",
"tai",
"tap",
"tgo",
"tin",
"tj",
"tll",
"Trl",
"ttk",
"tup",
"twi",
"tx",
"Ubx",
"unc-4",
"unpg",
"Usf",
"usp",
"vis",
"vnd",
"vri",
"Vsx1",
"Vsx2",
"vvl",
"wor",
"Xrp1",
"z",
"zen",
"zen2",
"Zif",
"ZIPIC",
"zld"
];

export {motifs};