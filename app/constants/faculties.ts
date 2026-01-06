// Shared constants for faculties and majors data
import { Faculty } from "@/types";

export const FACULTIES: Faculty[] = [
  {
    id: 1,
    nameEn: "Medicine",
    nameAr: "الطب",
    majors: [
      { id: 1, code: "MD", nameEn: "Doctor Of Medicine (MD)", nameAr: "دكتور في الطب" },
      { id: 39, code: "DVM", nameEn: "Doctor Of Veterinary Medicine (DVM)", nameAr: "دكتور في الطب البيطري" },
      { id: 33, code: "DDS", nameEn: "Doctor Of Dental Surgery", nameAr: "دكتور في جراحة الأسنان" },
    ]
  },
  {
    id: 2,
    nameEn: "Applied Medical Sciences",
    nameAr: "العلوم الطبية التطبيقية",
    majors: [
      { id: 2, code: "HMP", nameEn: "Health Management And Policy", nameAr: "إدارة وسياسة صحية" },
      { id: 3, code: "MLS", nameEn: "Medical Laboratory Sciences", nameAr: "علوم المختبرات الطبية" },
      { id: 4, code: "PARA", nameEn: "Paramedics", nameAr: "المسعفين" },
      { id: 5, code: "RT", nameEn: "Radiologic Technology", nameAr: "تكنولوجيا الأشعة" },
      { id: 6, code: "OPT", nameEn: "Optometry", nameAr: "البصريات" },
      { id: 7, code: "PT", nameEn: "Physical Therapy", nameAr: "العلاج الطبيعي" },
      { id: 8, code: "OT", nameEn: "Occupational Therapy", nameAr: "العلاج الوظيفي" },
      { id: 9, code: "ASP", nameEn: "Audiology & Speech Pathology", nameAr: "السمعيات وأمراض النطق" },
      { id: 10, code: "RESP", nameEn: "Respiratory Therapy", nameAr: "العلاج التنفسي" },
      { id: 11, code: "ANES", nameEn: "Anesthesia Technology", nameAr: "تكنولوجيا التخدير" },
      { id: 12, code: "CPSY", nameEn: "Clinical Psychology", nameAr: "علم النفس السريري" },
      { id: 13, code: "DDT", nameEn: "Digital Dental Technology", nameAr: "تكنولوجيا الأسنان الرقمية" },
      { id: 14, code: "DH", nameEn: "Dental Hygienist", nameAr: "صحة الأسنان" },
    ]
  },
  {
    id: 4,
    nameEn: "Pharmacy",
    nameAr: "الصيدلة",
    majors: [
      { id: 27, code: "PHAR", nameEn: "Pharmacy", nameAr: "الصيدلة" },
      { id: 28, code: "PHARMD", nameEn: "Doctor Of Pharmacy (Pharm D.)", nameAr: "دكتور في الصيدلة" },
      { id: 29, code: "PBM", nameEn: "Pharmaceutical And Biological Manufacturing", nameAr: "التصنيع الصيدلاني والبيولوجي" },
      { id: 30, code: "ACS", nameEn: "Applied Cosmetic Sciences", nameAr: "علوم التجميل التطبيقية" },
    ]
  },
  {
    id: 3,
    nameEn: "Engineering",
    nameAr: "الهندسة",
    majors: [
      { id: 15, code: "CHE", nameEn: "Chemical Engineering", nameAr: "الهندسة الكيميائية" },
      { id: 16, code: "CE", nameEn: "Civil Engineering", nameAr: "الهندسة المدنية" },
      { id: 17, code: "EE", nameEn: "Electrical Engineering", nameAr: "الهندسة الكهربائية" },
      { id: 18, code: "ME", nameEn: "Mechanical Engineering", nameAr: "الهندسة الميكانيكية" },
      { id: 19, code: "BME", nameEn: "Biomedical Engineering", nameAr: "الهندسة الطبية الحيوية" },
      { id: 20, code: "IE", nameEn: "Industrial Engineering", nameAr: "الهندسة الصناعية" },
      { id: 21, code: "AE", nameEn: "Aeronautical Engineering", nameAr: "هندسة الطيران" },
      { id: 22, code: "AMT", nameEn: "Aircraft Maintenance Technology", nameAr: "تكنولوجيا صيانة الطائرات" },
      { id: 23, code: "PDDE", nameEn: "Product Design & Development Engineering", nameAr: "هندسة تصميم وتطوير المنتجات" },
      { id: 24, code: "NE", nameEn: "Nuclear Engineering", nameAr: "الهندسة النووية" },
      { id: 25, code: "IEST", nameEn: "Intelligent Electrical Systems Technology", nameAr: "تكنولوجيا الأنظمة الكهربائية الذكية" },
      { id: 26, code: "UAVT", nameEn: "Unmanned Aerial Vehicles Technology", nameAr: "تكنولوجيا المركبات الجوية بدون طيار" },
    ]
  },
  {
    id: 5,
    nameEn: "Nursing",
    nameAr: "التمريض",
    majors: [
      { id: 31, code: "NURS", nameEn: "Nursing", nameAr: "التمريض" },
      { id: 32, code: "MID", nameEn: "Midwifery", nameAr: "القبالة" },
    ]
  },
  {
    id: 7,
    nameEn: "Agriculture",
    nameAr: "الزراعة",
    majors: [
      { id: 34, code: "SI", nameEn: "Soil & Irrigation", nameAr: "التربة والري" },
      { id: 35, code: "DA", nameEn: "Digital Agriculture", nameAr: "الزراعة الرقمية" },
      { id: 36, code: "CN", nameEn: "Clinical Nutrition", nameAr: "التغذية السريرية" },
      { id: 37, code: "PST", nameEn: "Plant Science And Technology", nameAr: "علوم وتكنولوجيا النبات" },
      { id: 38, code: "AST", nameEn: "Animal Science And Technology", nameAr: "علوم وتكنولوجيا الحيوان" },
    ]
  },
  {
    id: 9,
    nameEn: "Computer & Information Technology",
    nameAr: "الحاسوب وتكنولوجيا المعلومات",
    majors: [
      { id: 40, code: "CPE", nameEn: "Computer Engineering", nameAr: "هندسة الحاسوب" },
      { id: 41, code: "CS", nameEn: "Computer Science", nameAr: "علوم الحاسوب" },
      { id: 42, code: "NES", nameEn: "Network Engineering And Security", nameAr: "هندسة وأمن الشبكات" },
      { id: 43, code: "SE", nameEn: "Software Engineering", nameAr: "هندسة البرمجيات" },
      { id: 44, code: "CYB", nameEn: "Cybersecurity", nameAr: "الأمن السيبراني" },
      { id: 45, code: "DS", nameEn: "Data Science", nameAr: "علوم البيانات" },
      { id: 46, code: "AI", nameEn: "Artificial Intelligence", nameAr: "الذكاء الاصطناعي" },
      { id: 47, code: "IOT", nameEn: "Internet Of Things", nameAr: "إنترنت الأشياء" },
      { id: 48, code: "CGDD", nameEn: "Computer Games Design And Development", nameAr: "تصميم وتطوير ألعاب الحاسوب" },
      { id: 49, code: "HIS", nameEn: "Health Information Systems", nameAr: "أنظمة المعلومات الصحية" },
      { id: 50, code: "ROB", nameEn: "Robotics Science", nameAr: "علم الروبوتات" },
    ]
  },
  {
    id: 11,
    nameEn: "Institute Of Nanotechnology",
    nameAr: "معهد تكنولوجيا النانو",
    majors: [
      { id: 56, code: "NMS", nameEn: "Nanotechnology And Materials Science", nameAr: "تكنولوجيا النانو وعلوم المواد" },
    ]
  },
  {
    id: 12,
    nameEn: "Architecture And Design",
    nameAr: "العمارة والتصميم",
    majors: [
      { id: 57, code: "AR", nameEn: "Architecture", nameAr: "العمارة" },
      { id: 58, code: "UEPE", nameEn: "Urban And Environmental Planning Engineering", nameAr: "هندسة التخطيط العمراني والبيئي" },
      { id: 59, code: "DFMT", nameEn: "Digital Film And Multimedia Technology", nameAr: "تكنولوجيا الأفلام الرقمية والوسائط المتعددة" },
      { id: 60, code: "AGD", nameEn: "Animation And Game Design", nameAr: "تصميم الرسوم المتحركة والألعاب" },
    ]
  },
  {
    id: 10,
    nameEn: "Science & Arts",
    nameAr: "العلوم والآداب",
    majors: [
      { id: 51, code: "ELAL", nameEn: "English Language And Applied Linguistics", nameAr: "اللغة الإنجليزية واللسانيات التطبيقية" },
      { id: 52, code: "MATH", nameEn: "Mathematics", nameAr: "الرياضيات" },
      { id: 53, code: "CHEM", nameEn: "Chemistry", nameAr: "الكيمياء" },
      { id: 54, code: "PHYS", nameEn: "Physics", nameAr: "الفيزياء" },
      { id: 55, code: "BGE", nameEn: "Biotechnology & Genetic Engineering", nameAr: "التكنولوجيا الحيوية والهندسة الوراثية" },
    ]
  },
];
