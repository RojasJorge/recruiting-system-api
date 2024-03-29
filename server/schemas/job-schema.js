const Joi = require('joi');

let dt = new Date();
dt.setMonth(dt.getMonth() + 1);

const _get = Joi.object().keys({
  id: Joi.string()
    .min(6)
    .max(36)
    .optional(),
  jobposition: Joi.string()
    .allow('', null)
    .optional(),
  title: Joi.string()
    .max(60)
    .allow('', null)
    .optional(),
  company_id: Joi.string()
    .min(6)
    .max(36)
    .optional(),
  expiration_date: Joi.date().optional(),
  status: Joi.string()
    .valid('public', 'draft', 'expired')
    .optional(),
  availability: Joi.string()
    // .valid('freelance', 'practicing', 'temporary', 'full_time', 'part_time', 'vacationer')
    .optional(),
  province: Joi.string()
    .max(100)
    .optional(),
  city: Joi.string()
    .max(100)
    .optional(),
  salary: Joi.object()
    .keys({
      min: Joi.number()
        .default(0.0)
        .optional(),
      max: Joi.number()
        .default(0.0)
        .optional(),
      currency: Joi.string()
        .max(1)
        .default('q')
        .uppercase()
        .optional(),
    })
    .optional(),
  gender: Joi.string()
    .valid('male', 'female', 'indifferent')
    .optional(),
  age: Joi.object()
    .keys({
      min: Joi.number().optional(),
      max: Joi.number().optional(),
    })
    .optional(),
  religion: Joi.string()
    .max(100)
    .optional(),
  race: Joi.string()
    .max(100)
    .optional(),
  page: Joi.number()
    .default(1)
    .optional(),
  offset: Joi.number()
    .default(10)
    .optional(),
});

const _get_id = Joi.object({
  id: Joi.string()
    .min(6)
    .max(36)
    .optional(),
});

const _add = Joi.object().keys({
  created_at: Joi.date()
    .default(new Date())
    .forbidden(),
  dependents: Joi.number()
    .default(0)
    .optional(),
  updated_at: Joi.date()
    .default(new Date())
    .forbidden(),
  expiration_date: Joi.date()
    .default(dt)
    .optional(),
  status: Joi.string()
    .valid('public', 'draft', 'expired')
    .default('draft')
    .optional(),
  archive: Joi.boolean()
    .default(false)
    .optional(),
  company_id: Joi.string()
    .min(6)
    .max(36)
    .required(),
  company_state: Joi.string()
    .valid('public', 'confidential')
    .default('public')
    .optional(),
  avatar: Joi.string()
    .max(50)
    .allow(null, '')
    .default(null)
    .optional(),
  title: Joi.string()
    .min(6)
    .max(250)
    .required(),
  availability: Joi.string()
    // .valid('freelance', 'practicing', 'temporary', 'full_time', 'part_time', 'vacationer')
    .default('temporal')
    .optional(),
  career: Joi.array()
    .items(
      Joi.object().keys({
        id: Joi.string()
          .min(6)
          .max(36)
          .allow(null, '')
          .required(),
        name: Joi.string()
          .min(2)
          .max(150)
          .allow(null, '')
          .optional(),
        status: Joi.boolean()
          .default(true)
          .optional(),
        level: Joi.number()
          .integer()
          .default(0)
          .allow(null, '')
          .optional(),
        parent: Joi.string()
          .min(10)
          .max(36)
          .allow(null, '')
          .default(null)
          .optional(),
      }),
    )
    .optional(),
  schedule_type: Joi.string()
    .valid('fixed', 'flex', 'daytime', 'night', 'mix')
    .allow(null, '')
    .default('flex')
    .optional(),
  schedule: Joi.string()
    .max(2000)
    .allow(null, '')
    .optional(),
  description: Joi.string()
    .max(2000)
    .allow(null, '')
    .optional(),
  workplace: Joi.string()
    .max(2000)
    .allow(null, '')
    .optional(),
  relocate: Joi.boolean()
    .allow(null, '')
    .default(false)
    .optional(),
  travel: Joi.boolean()
    .allow(null, '')
    .default(false)
    .optional(),
  location: Joi.object()
    .keys({
      address: Joi.string()
        .max(250)
        .allow(null, '')
        .default(null)
        .optional(),
      zone: Joi.number()
        .default(0)
        .allow(null, '')
        .optional(),
      country: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
      province: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
      city: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
    })
    .optional(),
  branch: Joi.object()
    .keys({
      address: Joi.string()
        .max(250)
        .allow(null, '')
        .default(null)
        .optional(),
      zone: Joi.number()
        .default(0)
        .allow(null, '')
        .optional(),
      country: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
      province: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
      city: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
    })
    .default(null)
    .optional(),
  gender: Joi.string()
    .valid('male', 'female', 'indifferent')
    .default('indifferent')
    .optional(),
  age: Joi.object()
    .keys({
      min: Joi.number()
        .default(0)
        .allow(null, '')
        .optional(),
      max: Joi.number()
        .default(0)
        .allow(null, '')
        .optional(),
    })
    .optional(),
  religion: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  required_years: Joi.number()
    .default(0)
    .allow(null, '')
    .optional(),
  academic_level: Joi.array()
    .items(
      Joi.object()
        .keys({
          id: Joi.string()
            .allow(null, '')
            .max(36)
            .optional(),
          studyNow: Joi.boolean()
            .allow(null, '')
            .default(true)
            .optional(),
          logic: Joi.boolean()
            .allow(null, '')
            .default(null)
            .optional(),
          name: Joi.string()
            .allow(null, '')
            .max(150)
            .optional(),
          children: Joi.object()
            .keys({
              id: Joi.string()
                .allow(null, '')
                .max(36)
                .optional(),
              name: Joi.string()
                .allow(null, '')
                .max(150)
                .optional(),
            })
            .allow(null)
            .default(null)
            .optional(),
        })
        .allow(null)
        .default(null)
        .optional(),
    )
    .optional(),
  skills: Joi.array()
    .items(Joi.string())
    .allow(null)
    .default([])
    .optional(),
  languages: Joi.array()
    .items(
      Joi.object().keys({
        language: Joi.string()
          .allow(null, '')
          .max(36)
          .optional(),
        comprehension: Joi.number()
          .default(0)
          .allow(null, '')
          .optional(),
        speak: Joi.number()
          .default(0)
          .allow(null, '')
          .optional(),
        write: Joi.number()
          .default(0)
          .allow(null, '')
          .optional(),
      }),
    )
    .optional(),
  softwares: Joi.array()
    .items(Joi.string())
    .allow(null, '')
    .default([])
    .optional(),
  responsibilities: Joi.string()
    .max(2000)
    .allow(null, '')
    .default(null)
    .optional(),
  requirements: Joi.string()
    .max(2000)
    .allow(null, '')
    .default(null)
    .optional(),
  vehicle: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  type_license: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  benefits: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  benefits_other: Joi.string()
    .max(2000)
    .allow(null, '')
    .default(null)
    .optional(),
  salary: Joi.object()
    .keys({
      currency: Joi.object().keys({
        code: Joi.string()
          .max(3)
          .default('gtq')
          .uppercase()
          .optional(),
        name: Joi.string()
          .max(100)
          .optional(),
        symbol: Joi.string()
          .max(3)
          .uppercase()
          .optional(),
      }),
      base_min: Joi.number()
        .default(0.0)
        .allow(null, '')
        .optional(),
      base_max: Joi.number()
        .default(0.0)
        .allow(null, '')
        .optional(),
      commission_min: Joi.number()
        .default(0.0)
        .allow(null, '')
        .optional(),
      commission_max: Joi.number()
        .default(0.0)
        .allow(null, '')
        .optional(),
      salary_min: Joi.number()
        .allow(null, '')
        .default(null)
        .optional(),
      salary_max: Joi.number()
        .allow(null, '')
        .default(null)
        .optional(),
    })
    .optional(),
  jobposition: Joi.string()
    .optional()
    .allow(null, ''),
  positionalt: Joi.string()
    .optional()
    .allow(null, ''),
  isBranch: Joi.boolean()
    .default(false)
    .optional(),
  locationState: Joi.string()
    .optional()
    .default('public')
    .valid('public', 'private')
    .allow('', null),
  experience: Joi.number()
    .optional()
    .allow('', null),
  interviewPlace: Joi.string()
    .optional()
    .valid('branch', 'office')
    .allow('', null),
});

const _update = Joi.object().keys({
  created_at: Joi.date().optional(),
  interviewPlace: Joi.string()
    .optional()
    .valid('branch', 'office')
    .allow('', null),
  dependents: Joi.number()
    .default(0)
    .optional(),
  experience: Joi.number()
    .optional()
    .allow('', null),
  locationState: Joi.string()
    .optional()
    .default('public')
    .valid('public', 'private')
    .allow('', null),
  isBranch: Joi.boolean()
    .default(false)
    .optional(),
  jobposition: Joi.string()
    .optional()
    .allow(null, ''),
  positionalt: Joi.string()
    .optional()
    .allow(null, ''),
  expiration_date: Joi.date().optional(),
  status: Joi.string()
    .valid('public', 'draft', 'expired')
    .optional(),
  archive: Joi.boolean().optional(),
  company_state: Joi.string()
    .valid('public', 'confidential')
    .default('public')
    .optional(),
  avatar: Joi.string()
    .max(50)
    .allow(null, '')
    .default(null)
    .optional(),
  title: Joi.string()
    .min(6)
    .max(250)
    .optional(),
  availability: Joi.string()
    // .valid('freelance', 'practicing', 'temporary', 'full_time', 'part_time', 'vacationer')
    .default('temporal')
    .optional(),
  career: Joi.array()
    .items(
      Joi.object().keys({
        id: Joi.string()
          .min(6)
          .max(36)
          .allow(null, '')
          .required(),
        name: Joi.string()
          .min(2)
          .max(150)
          .allow(null, '')
          .optional(),
        status: Joi.boolean()
          .default(true)
          .allow(null, '')
          .optional(),
        level: Joi.number()
          .integer()
          .default(0)
          .optional(),
        parent: Joi.string()
          .min(10)
          .max(36)
          .allow(null, '')
          .default(null)
          .optional(),
      }),
    )
    .optional(),
  schedule_type: Joi.string()
    .valid('fixed', 'flex', 'daytime', 'night', 'mix')
    .allow(null, '')
    .default('flex')
    .optional(),
  schedule: Joi.string()
    .max(2000)
    .allow(null, '')
    .optional(),
  description: Joi.string()
    .max(2000)
    .allow(null, '')
    .optional(),
  workplace: Joi.string()
    .max(2000)
    .allow(null, '')
    .optional(),
  relocate: Joi.boolean()
    .allow(null, '')
    .default(false)
    .optional(),
  travel: Joi.boolean()
    .allow(null, '')
    .default(false)
    .optional(),
  location: Joi.object()
    .keys({
      address: Joi.string()
        .max(250)
        .allow(null, '')
        .default(null)
        .optional(),
      zone: Joi.number()
        .default(0)
        .allow(null, '')
        .optional(),
      country: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
      province: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
      city: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
    })
    .optional(),
  branch: Joi.object()
    .keys({
      address: Joi.string()
        .max(250)
        .allow(null, '')
        .default(null)
        .optional(),
      zone: Joi.number()
        .default(0)
        .allow(null, '')
        .optional(),
      country: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
      province: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
      city: Joi.string()
        .max(100)
        .default('Guatemala')
        .optional(),
    })
    .optional(),
  gender: Joi.string()
    .valid('male', 'female', 'indifferent')
    .default('indifferent')
    .optional(),
  age: Joi.object()
    .keys({
      min: Joi.number()
        .default(0)
        .allow(null, '')
        .optional(),
      max: Joi.number()
        .default(0)
        .allow(null, '')
        .optional(),
    })
    .optional(),
  religion: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  required_years: Joi.number()
    .default(0)
    .allow(null, '')
    .optional(),
  academic_level: Joi.array()
    .items(
      Joi.object()
        .keys({
          id: Joi.string()
            .allow(null, '')
            .max(36)
            .optional(),
          studyNow: Joi.boolean()
            .allow(null, '')
            .default(true)
            .optional(),
          logic: Joi.boolean()
            .allow(null, '')
            .default(null)
            .optional(),
          name: Joi.string()
            .allow(null, '')
            .max(150)
            .optional(),
          children: Joi.object()
            .keys({
              id: Joi.string()
                .allow(null, '')
                .max(36)
                .optional(),
              name: Joi.string()
                .allow(null, '')
                .max(150)
                .optional(),
            })
            .allow(null)
            .default(null)
            .optional(),
        })
        .allow(null)
        .default(null)
        .optional(),
    )
    .optional(),
  skills: Joi.array()
    .items(Joi.string())
    .default([])
    .allow(null)
    .optional(),
  languages: Joi.array()
    .items(
      Joi.object().keys({
        language: Joi.string()
          .allow(null, '')
          .max(36)
          .optional(),
        comprehension: Joi.number()
          .default(0)
          .allow(null, '')
          .optional(),
        speak: Joi.number()
          .default(0)
          .allow(null, '')
          .optional(),
        write: Joi.number()
          .default(0)
          .allow(null, '')
          .optional(),
      }),
    )
    .optional(),
  softwares: Joi.array()
    .items(Joi.string())
    .allow(null, '')
    .default([])
    .optional(),
  responsibilities: Joi.string()
    .max(2000)
    .allow(null, '')
    .default(null)
    .optional(),
  requirements: Joi.string()
    .max(2000)
    .allow(null, '')
    .default(null)
    .optional(),
  vehicle: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  type_license: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  benefits: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  benefits_other: Joi.string()
    .max(2000)
    .allow(null, '')
    .default(null)
    .optional(),
  salary: Joi.object()
    .keys({
      currency: Joi.object().keys({
        code: Joi.string()
          .max(3)
          .default('gtq')
          .uppercase()
          .optional(),
        name: Joi.string()
          .max(100)
          .optional(),
        symbol: Joi.string()
          .max(3)
          .uppercase()
          .optional(),
      }),
      base_min: Joi.number()
        .default(0.0)
        .allow(null, '')
        .optional(),
      base_max: Joi.number()
        .default(0.0)
        .allow(null, '')
        .optional(),
      commission_min: Joi.number()
        .default(0.0)
        .allow(null, '')
        .optional(),
      commission_max: Joi.number()
        .default(0.0)
        .allow(null, '')
        .optional(),
      salary_min: Joi.number()
        .allow(null, '')
        .default(null)
        .optional(),
      salary_max: Joi.number()
        .allow(null, '')
        .default(null)
        .optional(),
    })
    .optional(),
});

module.exports = {
  _get,
  _get_id,
  _add,
  _update,
};
