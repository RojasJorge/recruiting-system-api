'use strict'

const Joi = require('joi')

const id = Joi.object({
	id: Joi.string().min(36).max(36).required()
})

const update = Joi.object({
	fields: Joi.object().keys({
		personal: Joi.object().keys({
			avatar: Joi.string().allow(null, '').optional(),
			name: Joi.string().min(3).max(100).optional(),
			lastname: Joi.string().min(3).max(100).optional(),
			currentJobTitle: Joi.string().min(3).max(100).optional(),
			nationality: Joi.string().min(2).max(100).optional(),
			birthday: Joi.date().optional(),
			age: Joi.number().optional(),
			gender: Joi.string().min(3).max(50).optional(),
			religion: Joi.string().min(3).max(100).optional(),
			maritalStatus: Joi.string().min(3).max(100).optional(),
			children: Joi.number().optional(),
			dpi: Joi.string().optional(),
			nit: Joi.string().optional(),
			passport: Joi.number().allow(null, 'undefined').optional(),
			driversLicence: Joi.number().allow(null, 0).optional(),
			driversLicenceType: Joi.array().items(Joi.string()).optional(),
			email: Joi.string().email().optional(),
			phones: Joi.array().items(
				Joi.object().optional().keys({
					area: Joi.number().optional(),
					number: Joi.string().max(20).optional(),
					type: Joi.string().optional(),
				}),
			),
			location: Joi.object().keys({
				country: Joi.string().min(4).max(50),
				province: Joi.string().min(4).max(50),
				city: Joi.string().min(4).max(50),
				address: Joi.string().min(4).max(50),
				zone: Joi.number().max(50),
			}).optional(),
			about: Joi.string().max(2000).allow(null).optional(),
		}).optional(),
		academic: Joi.object().keys({
			// profesions: Joi.array()
			// 	.items(
			// 		Joi.object({
			// 			area: Joi.string().max(100),
			// 			profesion: Joi.string().max(100),
			// 			specialization: Joi.string().max(100),
			// 			collegiate: Joi.string().max(100),
			// 			collegiateNumber: Joi.number(),
			// 			experience: Joi.number(),
			// 		}),
			// 	).optional(),
			studies: Joi.array()
				.items(
					Joi.object({
						// id: Joi.number().required(),
						// _id: Joi.string().required(),
						establishment: Joi.string().max(100).optional(),
						academicLevel: Joi.string().max(100).optional().allow(null, '').optional(),
						specialization: Joi.string().max(100).optional().allow(null, ''),
						dateInit: Joi.date().optional().allow(null, ''),
						dateEnd: Joi.date().optional().allow(null, ''),
						currently: Joi.boolean().default(false).optional(),
						collegiate: Joi.string().max(100),
						// schedule: Joi.string().valid('daytime', 'evening', 'night', 'weekends', 'inline'),
					}),
				).optional(),
			courses: Joi.array()
				.items(
					Joi.object({
						establishment: Joi.string().max(100),
						titleCourse: Joi.string().max(100).optional().allow(null, ''),
						country: Joi.string().max(100).optional().allow(null, ''),
						year: Joi.date().optional(),
					}),
				).optional(),
		}),
		working: Joi.object().keys({
			experiences: Joi.array().items(
				Joi.object().keys({
					jobTitle: Joi.string().max(100),
					area: Joi.string().max(100),
					currency: Joi.string().max(8),
					amount: Joi.number(),
					company: Joi.string().max(100),
					companyPhone: Joi.string().max(15),
					specializationCompany: Joi.string().max(100),
					workingNow: Joi.boolean().default(false).optional(),
					dateInit: Joi.date().default(new Date()).optional(),
					dateEnd: Joi.date().default(new Date()).optional(),
					immediateBoss: Joi.array()
						.items(
							Joi.object().keys({
								name: Joi.string().max(100),
								titleJob: Joi.string().max(100),
								phone: Joi.number(),
							}),
						)
						.optional(),
					dependents: Joi.boolean(),
					totalDependents: Joi.number().default(0).optional(),
					whyResignation: Joi.string().max(800),
				}),
			),
			sindicate: Joi.boolean().default(false).optional(),
			whatSindicate: Joi.string().max(200).default('').optional(),
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
					baseMin: Joi.number(),
					baseMax: Joi.number(),
					base_min: Joi.number().default(0).optional(),
					base_max: Joi.number().default(0).optional(),
				})
				.optional(),
			otherIncome: Joi.boolean().optional(),
			otherIncomeValue: Joi.number().default(0).optional(),
			sourceIncome: Joi.string().default('').optional(),
			// nit: Joi.number().optional(),
			debts: Joi.array().items(
				Joi.object().keys({
					whatCompany: Joi.string().optional(),
					amount: Joi.number().optional(),
					monthlyFee: Joi.number().optional(),
				})
			),
			typeHousing: Joi.string().valid('own', 'family', 'rented').optional(),
			dependents: Joi.number().optional(),
			vehicles: Joi.array()
				.items(
					Joi.object().keys({
						type: Joi.string().optional(),
						brand: Joi.string().optional(),
						year: Joi.number().optional(),
						debts: Joi.boolean().optional(),
						amount: Joi.number().optional(),
					}),
				).optional(),
			health: Joi.object()
				.keys({
					haveDisease: Joi.boolean().default(false).optional(),
					disease: Joi.string().default('').allow('').optional(),
					tattoOrPiercing: Joi.boolean().default(false).optional(),
					whatTattoOrPiercing: Joi.string().default('').allow('').optional(),
					whtaTattoOrPiercing: Joi.boolean().default(false).allow('').optional()
				}).optional(),
			legal: Joi.object()
				.keys({
					legalProblem: Joi.boolean().optional(),
					whatProblem: Joi.string().max(800).allow('').optional(),
					infonetOrOther: Joi.boolean().optional(),
				}).optional(),
			allowed: Joi.boolean(),
		}),
		lookingFor: Joi.object().keys({
			availability: Joi.string().optional(),
			workplace: Joi.string().optional(),
			relocate: Joi.boolean().optional(),
			travel: Joi.boolean().optional(),
			hiringAvailability: Joi.string().valid('Immediate', 'One week', 'Time of law for change of work', 'One month').optional(),
		})
	})
})

module.exports = {
	id,
	update
}
