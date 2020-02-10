'use strict';

const Joi = require('@hapi/joi');

const _add = Joi.object().keys({
  steps: Joi.object(),
});

const ____add = Joi.object({
  personal: Joi.object().keys({
    avatar: Joi.string()
      .optional()
      .allow([null, '']),
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    lastname: Joi.string()
      .min(3)
      .max(100)
      .required(),
    currentJobTitle: Joi.string()
      .min(3)
      .max(100)
      .required(),
    nationality: Joi.string()
      .min(3)
      .max(100)
      .required(),
    birthday: Joi.date().required(),
    age: Joi.number().required(),
    gender: Joi.string()
      .min(3)
      .max(50)
      .required(),
    religion: Joi.string()
      .min(3)
      .max(100)
      .optional(),
    maritalStatus: Joi.string()
      .min(3)
      .max(100)
      .optional(),
    children: Joi.number()
      .default(0)
      .optional(),
    dpi: Joi.number()
      .default(0)
      .optional(),
    passport: Joi.number()
      .allow(null)
      .optional(),
    driversLicence: Joi.number()
      .allow(null)
      .optional(),
    driversLicenceType: Joi.string()
      .min(1)
      .max(2)
      .optional(),
    email: Joi.string()
      .email()
      .required(),
    phones: Joi.array().items(
      Joi.object()
        .optional()
        .keys({
          area: Joi.number().optional(),
          number: Joi.number().optional(),
          type: Joi.string().optional(),
        }),
    ),
    location: Joi.object()
      .keys({
        country: Joi.string()
          .min(4)
          .max(50),
        province: Joi.string()
          .min(4)
          .max(50),
        city: Joi.string()
          .min(4)
          .max(50),
        address: Joi.string()
          .min(4)
          .max(50),
        zone: Joi.number().max(50),
      })
      .optional(),
    about: Joi.string()
      .max(2000)
      .allow(null)
      .optional(),
  }),
  academic: Joi.object().keys({
    profesions: Joi.array()
      .items(
        Joi.object({
          area: Joi.string().max(100),
          profesion: Joi.string().max(100),
          specialization: Joi.string().max(100),
          collegiate: Joi.string().max(100),
          collegiateNumber: Joi.number(),
          experience: Joi.number(),
        }),
      )
      .optional(),
    studies: Joi.array()
      .items(
        Joi.object({
          school: Joi.string().max(100),
          academicLevel: Joi.string()
            .max(100)
            .optional()
            .allow([null, '']),
          specialization: Joi.string()
            .max(100)
            .optional()
            .allow([null, '']),
          dateInit: Joi.date()
            .optional()
            .allow([null, '']),
          dateEnd: Joi.date()
            .optional()
            .allow([null, '']),
          studyNow: Joi.boolean(),
          schedule: Joi.string().valid(['daytime', 'evening', 'night', 'weekends', 'inline']),
        }),
      )
      .optional(),
    courses: Joi.array()
      .items(
        Joi.object({
          establishment: Joi.string().max(100),
          titleCourse: Joi.string()
            .max(100)
            .optional()
            .allow([null, '']),
          place: Joi.string()
            .max(100)
            .optional()
            .allow([null, '']),
          year: Joi.number().optional(),
        }),
      )
      .optional(),
  }),
  working: Joi.object().keys({
    experience: Joi.array().items(
      Joi.object().keys({
        jobTitle: Joi.string().max(100),
        area: Joi.string().max(100),
        profesion: Joi.string().max(100),
        specialization: Joi.string().max(100),
        company: Joi.string().max(100),
        specializationCompany: Joi.string().max(100),
        workingNow: Joi.boolean(),
        dateInit: Joi.date(),
        dateEnd: Joi.date(),
        imediatiBoss: Joi.array()
          .items(
            Joi.object().keys({
              name: Joi.string().max(100),
              titleJob: Joi.string().max(100),
              phone: Joi.number(),
            }),
          )
          .optional(),
        dependents: Joi.boolean(),
        dependentsNumber: Joi.number(),
        whyResignation: Joi.string().max(800),
      }),
    ),
    sindicate: Joi.boolean().optional(),
    whatSindicate: Joi.string()
      .max(200)
      .optional(),
  }),
  others: Joi.object().keys({
    languages: Joi.array()
      .items(
        Joi.object().keys({
          language: Joi.string(),
          comprehension: Joi.number(),
          speak: Joi.number(),
          write: Joi.number(),
        }),
      )
      .optional(),
    softwares: Joi.array().items(Joi.string().max(100)),
    skills: Joi.array().items(Joi.string().max(100)),
  }),
  economic: Joi.object().keys({
    currentSalary: Joi.number().optional(),
    desiredSalary: Joi.object()
      .keys({
        currency: Joi.string().default('GTQ'),
        base_min: Joi.number(),
        base_max: Joi.number(),
      })
      .optional(),
    otherIncome: Joi.boolean().optional(),
    otherIncomeValue: Joi.string().optional(),
    sourceIncome: Joi.string().optional(),
    nit: Joi.number().optional(),
    debts: Joi.object()
      .keys({
        haveDebts: Joi.boolean().optional(),
        whatCompany: Joi.string().optional(),
        amount: Joi.number().optional(),
        monthlyFee: Joi.number().optional(),
      })
      .optional(),
    typeHousing: Joi.string()
      .valid(['own', 'family', 'rented'])
      .optional(),
    dependents: Joi.number().optional(),
    vehicle: Joi.array()
      .items(
        Joi.object().keys({
          type: Joi.string().optional(),
          brand: Joi.string().optional(),
          year: Joi.number().optional(),
          debts: Joi.boolean().optional(),
          amount: Joi.string().optional(),
        }),
      )
      .optional(),
    health: Joi.object()
      .keys({
        haveDisease: Joi.boolean().optional(),
        disease: Joi.string().optional(),
        tattoOrPiercing: Joi.boolean().optional(),
      })
      .optional(),
    legal: Joi.object()
      .keys({
        legalProblem: Joi.boolean().optional(),
        whatProblem: Joi.string()
          .max(800)
          .optional(),
        infonetOrOther: Joi.boolean().optional(),
      })
      .optional(),
    allowed: Joi.boolean(),
  }),

  lookingFor: Joi.object().keys({
    availability: Joi.string().optional(),
    workplace: Joi.string().optional(),
    relocate: Joi.boolean().optional(),
    travel: Joi.boolean().optional(),
    hiringAvailability: Joi.string()
      .valid(['Immediate', 'One week', 'Time of law for change of work', 'One month'])
      .optional(),
  }),
});

module.exports = {
  _add,
};

/**
 * PROFILE SCHEME.....
 * ------------------------------------
 */

// {
//   personal: {
//     avatar: null,
//     passport: "",
//     email: "",
//     age: 0,
//     birthday: "",
//     name: "",
//     lastname: "",
//     nationality: "",
//     gender: "",
//     currentJobTitle: "",
//     religion: "",
//     maritalStatus: "",
//     children: 0,
//     dpi: "",
//     driversLicence: "",
//     driversLicenceType: "",
//     phones: [],
//     location: {
//       country: "",
//       province: "",
//       city: "",
//       address: "",
//       zone: 0,
//     },
//     about: "",
//   },
//   academic: {
//     studies: [],
//     professions: [
//       {
//         provisionalId: "001",
//         area: "",
//         profesion: "",
//         specialization: "",
//         collegiate: "",
//         collegiateNumber: 0,
//         experience: 0,
//       },
//     ],
//     courses: [],
//   },
//   working: {
//     experiences: [],
//   },
//   document: {
//     documentFile: [],
//   },
//   economic: {
//     currentSalary: 0,
//     currentSalaryCurrency: "",
//     desiredSalary: {
//       currency: "",
//       base_min: 0,
//       base_max: 0,
//     },
//     otherIncome: false,
//     otherIncomeValue: 0,
//     sourceIncome: "",
//     nit: 0,
//     debts: {
//       haveDebts: "",
//       whatCompany: "",
//       amout: "",
//       monthlyFee: "",
//     },
//     typeHousing: "",
//     dependents: 0,
//     vehicles: [],
//     health: {
//       haveDisease: false,
//       disease: "",
//       tattoOrPiercing: false,
//     },
//     legal: {
//       legalProblem: false,
//       whatProblem: "",
//       infonetOrOther: false,
//     },
//     allowed: false,
//   },
//   others: {
//     languages: [],
//     softwares: [],
//     skills: [],
//   },
//   lookingFor: {
//     availability: "",
//     workplace: "",
//     relocate: false,
//     travel: false,
//   },
// };
