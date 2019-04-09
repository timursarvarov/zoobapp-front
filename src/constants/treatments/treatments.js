import toggleLocation from './toggle-location';

export default [
   {
      code: '1',
      title: 'Diagnose',
      codes: [
         {
            code: '1.1',
            title: 'Consultation and treatment plan',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '1.2',
            title: 'Periapical X-Ray',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '1.3',
            title: 'Bitewing X-Ray',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '1.4',
            title: 'Panoramic X-Ray',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '1.5',
            title: 'Cephalometric X-ray',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '1.6',
            title: 'ConeBeam CT X-ray (1 jaw)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '1.7',
            title: 'ConeBeam CT X-ray (2 jaw)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '1.8',
            title: 'Blood test',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
      ],
   },
   {
      code: '2',
      title: 'Restoration',
      codes: [
         {
            code: '2.1',
            title: 'Composite filling (minimal)',
            explain: '',
            locations: {
               coronaLingualIncisalDistal: true,
               coronaLingualIncisalMiddle: true,
               coronaLingualIncisionMesial: true,
               coronaLingualMiddleDistal: true,
               coronaLingualMiddleMiddle: true,
               coronaLingualMiddleMesial: true,
               coronaLingualCervicalDistal: true,
               coronaLingualCervicalMiddle: true,
               coronaLingualCervicalMesial: true,
               coronaLabialIncisalDistal: true,
               coronaLabialIncisalMiddle: true,
               coronaLabialIncisionMesial: true,
               coronaLabialMiddleDistal: true,
               coronaLabialMiddleMiddle: true,
               coronaLabialMiddleMesial: true,
               coronaLabialCervicalDistal: true,
               coronaLabialCervicalMiddle: true,
               coronaLabialCervicalMesial: true,
               coronaTopBuccal: true,
               coronaTopMedial: true,
               coronaTopLingual: true,
               coronaTopDistal: true,
               coronaTopOclusial: true,
            },
            view: {
               coronaLingual: true,
               coronaLingualIncisalDistal: true,
               coronaLingualIncisalMiddle: true,
               coronaLingualIncisionMesial: true,
               coronaLingualMiddleDistal: true,
               coronaLingualMiddleMiddle: true,
               coronaLingualMiddleMesial: true,
               coronaLingualCervicalDistal: true,
               coronaLingualCervicalMiddle: true,
               coronaLingualCervicalMesial: true,
               coronaLabial: true,
               coronaLabialIncisalDistal: true,
               coronaLabialIncisalMiddle: true,
               coronaLabialIncisionMesial: true,
               coronaLabialMiddleDistal: true,
               coronaLabialMiddleMiddle: true,
               coronaLabialMiddleMesial: true,
               coronaLabialCervicalDistal: true,
               coronaLabialCervicalMiddle: true,
               coronaLabialCervicalMesial: true,
               coronaTopBuccal: true,
               coronaTopMedial: true,
               coronaTopLingual: true,
               coronaTopDistal: true,
               coronaTopOclusial: true,
               root: true,
               gum: true,
            },
            setOnLoad: {},
            addLocation: (location, diagnose, originalDiagnose, toothId) => toggleLocation(location, diagnose, originalDiagnose, toothId),
         },
         {
            code: '2.2',
            title: 'Composite filling (moderate)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '2.3',
            title: 'Composite filling (enlarged)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '2.4',
            title: 'Composite filling (extensive)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '2.5',
            title: 'Cosmetic Composite resin restoration',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '2.6',
            title: 'Tooth gap filling',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '2.7',
            title: 'Sealant',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '2.8',
            title: 'Composite veneer',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '2.9',
            title: 'Dental dam',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
      ],
   },
   {
      code: '3',
      title: 'Root Canal',
      codes: [
         {
            code: '3.1',
            title: 'Root canal treatment (anterior)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '3.2',
            title: 'Root canal treatment (premolar)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '3.3',
            title: 'Root canal treatment (molar)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '3.4',
            title: 'Root canal re-treatment (anterior)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '3.5',
            title: 'Root canal re-treatment (premolar)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '3.6',
            title: 'Root canal re-treatment (molar)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '3.7',
            title: 'Direct pulp capping',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '3.8',
            title: 'Abscess drainage/Abscess treatment',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
      ],
   },
   {
      code: '4',
      title: 'Hygiena',
      codes: [
         {
            code: '4.1',
            title: 'Cleaning and polishing (Mild calculus)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '4.2',
            title: 'Cleaning and polishing (Moderate calculus)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '4.3',
            title: 'Cleaning and polishing (Heavy calculus)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '4.4',
            title: 'Teeth cleaning and polishing under local anesthetics',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '4.5',
            title: 'Periodontal pocket treatment (non-surgical)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '4.6',
            title: 'Operculectomy',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '4.7',
            title: 'Gum contouring surgery',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '4.8',
            title: 'Gum grafting',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
      ],
   },
   {
      code: '5',
      title: 'Whitening',
      codes: [
         {
            code: '5.1',
            title: 'At-home whitening kit (Zoom)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '5.2',
            title: 'In-office laser whitening with Zoom 2',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '5.3',
            title: 'Whitening Combination Package',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '5.4',
            title: 'Internal bleaching',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
      ],
   },
   {
      code: '6',
      title: 'Prosthetics',
      codes: [
         {
            code: '6.1',
            title: 'Crown removal',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '6.2',
            title: 'Temporary crown (PMMA)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '6.3',
            title: 'Re-cement crown',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '6.4',
            title: 'Composite inlay',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '6.5',
            title: 'All-porcelain inlay (Emax CAD)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '6.6',
            title: 'Composite onlay',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '6.7',
            title: 'All-porcelain onlay (Emax CAD)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '6.8',
            title: 'All-porcelain overlay (Emax CAD)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '6.9',
            title: 'Porcleain fused to titanium crown (CAD/CAM)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
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
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '7.2',
            title: 'Bone grafting',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '7.3',
            title: 'Guided bone regeneration membrane',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '7.4',
            title: 'Sinus augmentation (Closed)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '7.5',
            title: 'Sinus augmentation (Open)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '7.6',
            title: 'All on 8 (Nobel Biocare/SGS Switzerland dental implant)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '7.7',
            title: 'All on 6 (Nobel Biocare/SGS Switzerland dental implant)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
      ],
   },
   {
      code: '8',
      title: 'Orthondontic',
      codes: [
         {
            code: '8.1',
            title: 'Traditional metal braces - Simple case: no extraction required',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '8.2',
            title: 'Traditional metal braces - Requires extraction (fee for extraction is not included)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '8.3',
            title: 'Traditional metal braces - Complicated case: lost of molar, root treated teeth etc',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '8.4',
            title: 'Traditional ceramic braces - Simple case: no extraction required',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '8.5',
            title: 'Traditional ceramic braces - Requires extraction (fee for extraction is not included',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '8.6',
            title: 'Traditional ceramic braces - Complicated case: lost of molar, root treated teeth etc',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '8.7',
            title: 'Invisalign ClinCheck',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '8.8',
            title: 'Invisalign',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '8.9',
            title: 'Functional appliance',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
      ],
   },
   {
      code: '9',
      title: 'Surgey',
      codes: [
         {
            code: '9.1',
            title: 'Permanent tooth extraction',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '9.2',
            title: 'Wisdom tooth extraction (upper jaw)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '9.3',
            title: 'Wisdom tooth extraction (lower jaw)',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '9.4',
            title: 'Surgical tooth extraction',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '9.5',
            title: 'Tooth extraction with bone grafting',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '9.6',
            title: 'Crown lengthening surgery',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
         {
            code: '9.7',
            title: 'Gum contouring surgery',
            explain: '',
            locations: {},
            view: {},
            setOnLoad: {},
            addLocation: {},
         },
      ],
   },
];