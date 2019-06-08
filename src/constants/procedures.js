/* eslint-disable no-tabs */

export default [{
        code: '1',
        title: 'Diagnose',
        codes: [{
                code: '1.1',
                title: 'Consultation and treatment plan',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P01',
            },
            {
                code: '1.2',
                title: 'Periapical X-Ray',
                explain: '',
                defaultManipulations: [1, 2],
                available: true,
                templateCode: 'P01',
            },
            {
                code: '1.3',
                title: 'Bitewing X-Ray',
                explain: '',
                price: 12,
                available: false,
                templateCode: 'P01',
            },
            {
                code: '1.4',
                title: 'Panoramic X-Ray',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P01',
            },
            {
                code: '1.5',
                title: 'Cephalometric X-ray',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P01',
            },
            {
                code: '1.6',
                title: 'ConeBeam CT X-ray (1 jaw)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P01',
            },
            {
                code: '1.7',
                title: 'ConeBeam CT X-ray (2 jaw)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P01',
            },
            {
                code: '1.8',
                title: 'Blood test',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P01',
            },
        ],
    },
    {
        code: '2',
        title: 'Restoration',
        codes: [{
                code: '2.1',
                title: 'Composite filling (minimal)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P02',
            },
            {
                code: '2.2',
                title: 'Composite filling (moderate)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P02',
            },
            {
                code: '2.3',
                title: 'Composite filling (enlarged)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P02',
            },
            {
                code: '2.4',
                title: 'Composite filling (extensive)',
                explain: '',
                price: 12,
                templateCode: 'P02',
            },
            {
                code: '2.5',
                title: 'Cosmetic Composite resin restoration',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P02',
            },
            {
                code: '2.6',
                title: 'Tooth gap filling',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P02',
            },
            {
                code: '2.7',
                title: 'Sealant',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P03',

            },
            {
                code: '2.8',
                title: 'Composite veneer',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P06',
            },
            {
                code: '2.9',
                title: 'Dental dam',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
        ],
    },
    {
        code: '3',
        title: 'Root Canal',
        codes: [{
                code: '3.1',
                title: 'Root canal treatment (anterior)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P07',
            },
            {
                code: '3.2',
                title: 'Root canal treatment (premolar)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P07',
            },
            {
                code: '3.3',
                title: 'Root canal treatment (molar)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P07',
            },
            {
                code: '3.4',
                title: 'Root canal re-treatment (anterior)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P07',
            },
            {
                code: '3.5',
                title: 'Root canal re-treatment (premolar)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P07',
            },
            {
                code: '3.6',
                title: 'Root canal re-treatment (molar)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P07',
            },
            {
                code: '3.7',
                title: 'Direct pulp capping',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P07',
            },
            {
                code: '3.8',
                title: 'Abscess drainage/Abscess treatment',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P07',
            },
        ],
    },
    {
        code: '4',
        title: 'Hygiena',
        codes: [{
                code: '4.1',
                title: 'Cleaning and polishing (Mild calculus)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
            {
                code: '4.2',
                title: 'Cleaning and polishing (Moderate calculus)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
            {
                code: '4.3',
                title: 'Cleaning and polishing (Heavy calculus)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
            {
                code: '4.4',
                title: 'Teeth cleaning and polishing under local anesthetics',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
            {
                code: '4.5',
                title: 'Periodontal pocket treatment (non-surgical)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P05',
            },
            {
                code: '4.6',
                title: 'Operculectomy',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P20',
            },
            {
                code: '4.7',
                title: 'Gum contouring surgery',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P20',
            },
            {
                code: '4.8',
                title: 'Gum grafting',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P20',
            },
        ],
    },
    {
        code: '5',
        title: 'Whitening',
        codes: [{
                code: '5.1',
                title: 'At-home whitening kit (Zoom)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
            {
                code: '5.2',
                title: 'In-office laser whitening with Zoom 2',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
            {
                code: '5.3',
                title: 'Whitening Combination Package',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
            {
                code: '5.4',
                title: 'Internal bleaching',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P04',
            },
        ],
    },
    {
        code: '6',
        title: 'Prosthetics',
        codes: [{
                code: '6.1',
                title: 'Crown removal',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P09',
            },
            {
                code: '6.2',
                title: 'Temporary crown (PMMA)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P10',
            },
            {
                code: '6.3',
                title: 'Re-cement crown',
                explain: '',
                price: 12,
                templateCode: 'P10',
            },
            {
                code: '6.4',
                title: 'Composite inlay',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P11',
            },
            {
                code: '6.5',
                title: 'All-porcelain inlay (Emax CAD)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P11',
            },
            {
                code: '6.6',
                title: 'Composite onlay',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P11',
            },
            {
                code: '6.7',
                title: 'All-porcelain onlay (Emax CAD)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P11',
            },
            {
                code: '6.8',
                title: 'All-porcelain overlay (Emax CAD)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P11',
            },
            {
                code: '6.9',
                title: 'Porcleain fused to titanium crown (CAD/CAM)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P12',
            },
        ],
    },
    {
        code: '7',
        title: 'Implantation',
        codes: [

            {
                code: '7.1',
                title: 'Nobel Biocare/SGS Switzerland dental implant',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P13',
                ageCategory: ['adultTeeth'],
            },
            {
                code: '7.2',
                title: 'Bone grafting',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P14',
                ageCategory: ['adultTeeth'],
            },
            {
                code: '7.3',
                title: 'Guided bone regeneration membrane',
                explain: '',
                price: 12,
                templateCode: 'P14',
                ageCategory: ['adultTeeth'],
            },
            {
                code: '7.4',
                title: 'Sinus augmentation (Closed)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P14',
                ageCategory: ['adultTeeth'],
            },
            {
                code: '7.5',
                title: 'Sinus augmentation (Open)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P15',
                ageCategory: ['adultTeeth'],
            },
            {
                code: '7.6',
                title: 'All on 8 (Nobel Biocare/SGS Switzerland dental implant)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P16',
                ageCategory: ['adultTeeth'],
            },
            {
                code: '7.7',
                title: 'All on 6 (Nobel Biocare/SGS Switzerland dental implant)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P16',
                ageCategory: ['adultTeeth'],
            },
        ],
    },
    {
        code: '8',
        title: 'Orthondontic',
        codes: [{
                code: '8.1',
                title: 'Traditional metal braces - Simple case: no extraction required',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P17',

            },
            {
                code: '8.2',
                title: 'Traditional metal braces - Requires extraction (fee for extraction is not included)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P17',
            },
            {
                code: '8.3',
                title: 'Traditional metal braces - Complicated case: lost of molar, root treated teeth etc',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P17',
            },
            {
                code: '8.4',
                title: 'Traditional ceramic braces - Simple case: no extraction required',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P17',
            },
            {
                code: '8.5',
                title: 'Traditional ceramic braces - Requires extraction (fee for extraction is not included',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P17',
            },
            {
                code: '8.6',
                title: 'Traditional ceramic braces - Complicated case: lost of molar, root treated teeth etc',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P17',
            },
            {
                code: '8.7',
                title: 'Invisalign ClinCheck',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P17',
            },
            {
                code: '8.8',
                title: 'Invisalign',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P16',
            },
            {
                code: '8.9',
                title: 'Functional appliance',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P16',
            },
        ],
    },
    {
        code: '9',
        title: 'Surgey',
        codes: [{
                code: '9.1',
                title: 'Permanent tooth extraction',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P18',
            },
            {
                code: '9.2',
                title: 'Wisdom tooth extraction (upper jaw)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P18',
            },
            {
                code: '9.3',
                title: 'Wisdom tooth extraction (lower jaw)',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P18',
            },
            {
                code: '9.4',
                title: 'Surgical tooth extraction',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P18',
            },
            {
                code: '9.5',
                title: 'Tooth extraction with bone grafting',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P19',
            },
            {
                code: '9.6',
                title: 'Crown lengthening surgery',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P20',
            },
            {
                code: '9.7',
                title: 'Gum contouring surgery',
                explain: '',
                price: 12,
                available: true,
                templateCode: 'P20',
            },
        ],
    },
];