jQuery(document).ready(function() {
  var update_texts = function() {
    $('body').i18n();
    $('#messages').text($.i18n('message_from', 'Ann', 2, 'female'));
  };

  $('.lang-switch').click(function(e) {
    e.preventDefault();
    $.i18n().locale = $(this).data('locale');
      document.getElementsByTagName('html')[0].lang = $(this).data('locale');
      Cookies.set('lang', $(this).data('locale'));
    update_texts();
  });

  $.i18n().load({
      'en': {
        'confirm':'Confirm',
        'employee_line':'Employee Line',
        'employee_type' : 'Employee Type',
        'Server Status':'Server Status',
        'Chart':'Chart',
        'Some value are not allow, please try again': 'Some value are not allow, please try again',
        'Alert': 'Alert',
        'action': ' ',
        'show for selected group':'Show For Selected Group',
        'show no group':'Show No Group',
        'show all':'Show All',
        'menu':'MENU',
        'contacts': 'Contacts',
        'unknown': ' Unknown',
        'search': 'Search...',
        'recalculate':'Recalculate',
        'recalculate success':'Recalculate Success',
        'timeremining':'Time Remining',
        'directorysearch':' Directory Search',
        'department':'Department',
        'outbound':'Outbound',
        'inbound':'Inbound',

        'from':'From',
        'to': 'To',

        'date':'Date',
        'date:':'Date:',
        'direction:':'Direction:',
        'toll:':'Toll:',
        'logout':'Log out',
        'Logo': 'Logo',

        'Toll':'Toll',
        'tariffs':'Tariffs',
        'dashboard':'Dashboard',
        'locations':'Locations',
        'Areacodes & Rates': 'Areacodes & Rates',
        'configuration': "Configuration",
        'users': 'Users',
        'roles': 'Roles',
        'permission': 'Permission',
        'permissions': 'Permissions',
        'Today': 'Today',
        'Yesterday':'Yesterday',
        'This Week':'This Week',
        'Last Week':'Last Week',
        'This Month':'This Month',
        'Last Month':'Last Month',
        'Year to date':'Year to date',
        'select':'Select',
        'Manual Select': 'Manual Select',
        'select user details': 'Select User Details',
        'all users': 'All Users',
        'have group users': 'Have Group Users',
        'no group users':'No Group Users',
        'toll type':'Toll Type',
        'call type':'Call Type',
        'from route' : 'From Route',
        'to route': 'To Route',
        'from trunk': 'From Trunk',
        'to trunk': 'To Trunk',
        'from extension':'From Extension',
        'to extension':'To Extension',
        'from account':'From Account',
        'to account':'To Account',
        'through':'Through',
        'number of calls': 'Number of Calls',
        'total charges': 'Total Charges',
        'call durations': 'Call Durations',
        'Report Group': 'Report Group',
        'dialled number':'Dialled Number',
        'destination': 'Destination',
        'internal':'Internal',
        'incoming':'Incoming',
        'outgoing': 'Outgoing',
        'groups':'Groups',
        '-groups':'groups',

        'hotline':'HotLine',
        'local':'Local',
        'mobile':'Mobile',
        'domestic':'Domestic',
        'international':'International',

        'free': 'Free',

        //Header Report
        'extension summary report': 'Extension Summary Report',
        'extensions detail report':'Extension Detail Report',
        'group summary report':'Group Summary Report',
        'group detail report':'Group Detail Report',
	'group call detail report':'Group Call Detail Report',
        'destination summary report':'Destination Summary Report',
        'destination details report':'Destination Details Report',
        'dialled number summary report':'Dialled Number Summary Report',
        'dialled number detail report':'Dialled Number Detail Report',
        'user details report': 'User Detail Report',
        'trunk summary report': 'Trunk Summary Report',
        'trunk detail report': 'Trunk Detail Report', 
        'top trunk usage report': 'Top Trunk Usage Report',
        'top dialled number usage report': 'Top Dialled Number Usage Report',
        'top destination usage report':'Top Destination Usage Report',
        'top extension usage report': 'Top Extension Usage Report',
        'tranfer call report':'Transfer Call Report',
        //DashBoard 
        'connector':'CONNECTOR',
        'connector-status':'Not Running',
        'connector-status-on':'Running',
        'calculator':'CALCULATOR',
        'calculator-status':'Not Running',
        'calculator-status-on':'Running',
        'diskfree': 'DISK FREE',

        'caller':'Caller',
        'callee':'Called',
        'callername':'Caller Name',
        'dialnumber':'Dial Number',
        'destination':'Destination',
        'starttime':'Start Time',
        'endtime':'End Time',
        'duration':'Duration',
        'rate':'Rate',
        'cost':'Cost',
        //_________ Report 
        'DateTimeFrom':'Date Time From',
        'DateTimeTo':'Date Time To',
        'Report': 'Reports',
        'reportdate' : 'Report Date',
        'trunks':'Trunks',
        'viewreport': 'View Report',
        'usage type':'Usage Type',
        'rank value':'Rank Value',
        'top extension usage report': 'Top Extension Usage Report',
        'Chart Reports':' Chart Reports',
        'User Reports': ' User Reports',
        'Admin Reports':' Admin Reports',
        'Trunk Reports':' Trunk Reports',
        'Top Usage Reports': ' Top Usage Reports',
        'Case Details': 'Case Details',
        'Case Details Report': 'Case Details Report',
        'Case Details All': 'Case Details All',
        'Case Details All Report': 'Case Details All Report',
        'Case Status Summary': 'Case Status Summary',
        'Case Status Summary Report': 'Case Status Summary Report',
        'Case Type Summary': 'Case Type Summary',
        'Case Type Summary Report': 'Case Type Summary Report',
        'case_details': 'Case Details',
        'case_details_report': 'Case Details Report',
        'case_details_all': 'Case Details All',
        'case_details_all_report': 'Case Details All Report',
        'case_status_summary': 'Case Status Summary',
        'case_status_summary_report': 'Case Status Summary Report',
        'case_type_summary': 'Case Type Summary',
        'case_type_summary_report': 'Case Type Summary Report',
        'input_data_require': 'Input Data Require',
        'case_status': 'Case Status',
        'start_date': 'Start Date',
        'end_date': 'End Date',
        'monthly summary report':'Monthly Summary Report',
        'monthly charge summary report':'Monthly Charge Summary Report',
        'transfer call report':'Transfer Call Report',
        'summary report by group':'Summary Report By Group',
        'summary report':'Summary Report',
        'account code details report':'Account Code Details Report',
        'account code summary report':'Account Code Summary Report',

        //Breadcrumb
        'user report': 'User Report',
        'admin report': 'Admin Report',
        'trunks report': 'Trunks Report',
        'trunk': 'Trunk',

        //Permission
        'permission management': 'Permissions Management',
        'role of this permission': 'Role of this permission',
        'edit':'Edit',
        'remove':'Remove',
        'new': 'New',
        'create': 'Create',
        'save': 'Save',
        'cancel':'Cancel',
        'Profile ID':'Profile ID',
        'Permission Type':'Permission Type',
        'Active':'Active',
        'Roles ProfileID':'Roles (Profile ID)',
        'permissions in this role':'Permissions in this role',
        'Other permissions':'Other permissions',
        //Extension
        'extension:':'Extension:',
        'extension':'Extension',
        '-extension':'extension',
        'extensions': 'Extensions',
        'Client ID': 'Client ID',
        'Name': 'Name',
        'Org ID': 'Org ID',
        'Type': 'Type',
        'License': 'License',
        'Budget': 'Budget',
        'Balance': 'Balance',
        'Tenant': 'Tenant',
        'Authorization code': 'Authorization code',
        'Rent charge': 'Rent charge',
        'Search by name': 'Search by name',
        'Create Extension Range': 'Create Extension Range',
        'Create Extension': 'Create Extension',
        'Move to Organize': 'Move to Organize',
        'Organize List':'Organize List',
        'Organizations':'Organizations',
        'Normal':'Normal',
        'VIP':'VIP',
        'Guest':'Guest',
        'Auth Code':'Auth Code',
        'Authorize Code':'Authorize Code',
        'same extension?':'Same Extension?',
        'islicense?':'Is License?',
        'Create Ext.': 'Create Ext.',
        'move to main':'Move To Main',
        'delete group':'Delete Group',
        //User Management
        'close': 'Close',
        'User Management': 'User Management',
        'Users Management': 'Users Management',
        'Group ID':'Group ID',
        'Parent Group': 'Parent Group',
        'Group name': 'Group Name',
        'Username': 'Username',
        'Password': 'Password',
        'Role': 'Role',
        'Company': 'Company',
        'New User':'New User',
        'Fax':'Fax',
        'Email':'Email',
        'Role Name':'Role Name',
        'Add New User':'Add New User',
        'Enter Username':'Enter Username',
        'Enter Password':'Enter Password',
        'Enter Rolename':'Enter Rolename',
        'Enter Extension':'Enter Extension',
        'Enter Name':'Enter Name',
        'Enter Company':'Enter Company',
        'Enter Mobile':'Enter Mobile',
        'Enter Fax':'Enter Fax',
        'Enter Email':'Enter Email',
        'Enter Active': 'Enter Active',

        //Trunks&TrunkDetail
        'please select at least 1 user':'Please select at least 1 user',
        'create trunk':'Create Trunk',
        'create group':'Create Group',
        'move group':'Move Group',
        'edit group':'Edit Group',
        'route':'Route',
        'trk_name':'Trunk Name',
        'updated_on': 'Update',
        'has_child':'Has Child',
        'info':'Info',
        '-trunks':'trunks',
        'detail':'Detail',
        'create at':'Created At',
        'last updated':'Last Updated',
        'update':'Update',
        'delete':'Delete',
        'none':'NONE',
        'license create at': 'License created at',

        //Roles Management
        'Roles Management': 'Roles Management',
        'Users in this role': 'Users in this role',
        'Other user': ' Other user',
        'Apply': 'Apply',
        'Back to Form': 'Back to Form',
        'Back': 'Back',

        //Locataions
        'location':'Location',
        'add new areacode': 'Add New Areacode',
        'new location':'New Location',
        'add new location':'Add New Location',
        'charging model':'Charging Model',
        'enter route name':'Enter route name',
        'enter route':'Enter route',
        'enter trunk name': 'Enter trunk name',
        'enter trunk': 'Enter trunk',
        'enter reqex': 'Enter reqex',
        'enter regex': 'Enter regex',
        'enter location name': 'Enter location name',
        'enter reqex for prefix': 'Enter regex for reqex',
        'enter regex for provider': 'Enter regex for provider',
        'enter provider code':'Enter provider code',
        'enter area code':'Enter Area Code',
        'enter area name' : 'Enter Area Name',
        'select toll type': 'Select Toll Type',
        'select rate name':'Select Rate Name',
        'select day of week' : 'Select Day of Week',
        'enter charging data' : 'Enter Charging data',
        'tariff table' : 'Tariff Table',
        'prefix' : 'Prefix',
        'provider' : 'Provider',
        'model' : 'Model',
        'tariff':'Tariff',
        'select tariff table':'Select tariff table',

        //Tariff
        'Copy Areacode Data': 'Copy Areacode Data',
        'Areacode': 'Areacode',
        'New Areacode': 'New Areacode',
        'Areacodes': 'Areacodes',
        'Copy Rate Data': 'Copy Rate Data',
        'Copy Table':'Copy Table',
        'Copy Tariff Table':'Copy Tariff Table',
        'New Rate': 'New Rate',
        'Charging': 'Charging',
        'Add New Rate': 'Add New Rate',
        'Rates': 'Rates',
        'Rate ID': 'Rate ID',
        'Rate Name': 'Rate Name',
        'Any Day': 'Any Day',
        'Day Of Week': 'Day Of Week',
        'Weekday': 'Weekday',
        'Holiday': 'Holiday',
        'Monday': 'Monday',
        'Tuesday': 'Tuesday',
        'Wednesday': 'Wednesday',
        'Thursday': 'Thursday',
        'Friday': 'Friday',
        'Saturday': 'Saturday',
        'Sunday': 'Sunday',
        'Enter rate id': 'Enter rate id',
        'Enter rate name': 'Enter rate name',
        'Enter start time': 'Enter start time',
        'Enter end time': 'Enter end time',
        'Enter charging rate in JSON Array format': 'Enter charging rate in JSON Array format',

        //Directory Search 
        '-directorysearch': 'directory search',
        'rent_dial_number_fee':'Rent Dial Number Fee',
        'special_service_fee':'Special Service Fee',
        'org_path':'Organization path',
        'nameth':'Name(TH)',
        'name':'Name(Eng)',
        'exttype':'Extension Type',
        'email':'E-mail',
        'authorization_code':'Authorization Code',
        'no record data':'No Record Data',
        'callout':'Call OUT',
        'callin':'Call IN',
        'position':'Position',

        //Recalculate
        '-recalculate':'Recalculate',
        'recalculate by date' : 'Recalculate By Date',
        'recalculate by tolltype' : 'Recalculate By TollType',
        'recalculate by group' : 'Recalculate By Group',
        'recalculate by extension' : 'Recalculate By Extension',
        'loading':'Loading',
    },
      'th': {
        'confirm':'ยืนยัน',
        'employee_line': 'วิชาการ/วิชาชีพ',
        'employee_type': 'ประเภทการจ้างงาน',
        'Server Status': 'สถานะเซิร์ฟเวอร์',
        'Chart': 'แผนภูมิ',
        'Some value are not allow, please try again': 'ไม่อนุญาตให้ใช้ค่าบางอย่างโปรดลองอีกครั้ง',
        'Alert':'แจ้งเตือน',
        'action': ' ',
        'show for selected group': 'แสดงกลุ่มที่เลือก',
        'show no group': 'แสดงที่ไม่มีกลุ่ม',
        'show all': 'เเสดงทั้งหมด',
        'menu': 'เมนู',
        'unknown': 'ไม่ทราบ',
        'search': 'ค้นหา...',

        'recalculate': 'คำนวณค่าโทรใหม่',
        'recalculate success': 'คำนวณค่าโทรใหม่ สำเร็จเเล้ว',
        'timeremining': 'เวลาโดยประมาณ',
        'directorysearch': 'ค้นหาข้อมูลบุคคล',
        'department': 'แผนก',
        'outbound': 'ภายนอก',
        'inbound': 'ภายใน',

        'from': 'จาก',
        'to': 'ถึง',

        'date': 'วัน',
        'date:': 'วัน:',
        'direction:': 'ทาง:',
        'toll:':'ผ่านทาง:',
        'logout': 'ออกจากระบบ',
        'Logo': 'โลโก้',
        'Toll':'ผ่านทาง',

        'tariffs': 'อัตราราคาโทร',
        'dashboard': 'รายละเอียดการใช้โทรศัพท์',
        'locations': 'ตำแหน่งที่ตั้ง',
        'Areacodes & Rates': 'รหัสพื้นที่และอัตรา',
        'configuration': "การตั้งค่า",
        'users': 'ผู้ใช้',
        'roles': 'ตำแหน่ง',
        'permission': 'สิทธิ์',
        'Today': 'วันนี้',
        'Yesterday': 'เมื่อวาน',
        'This Week': 'ในสัปดาห์นี้',
        'Last Week': 'สัปดาห์ที่ผ่านมา',
        'This Month': 'เดือนนี้',
        'Last Month': 'เดือนที่ผ่านมา',
        'Year to date': 'ต้นปีถึงปัจจุบัน',
        'select':'เลือก',
        'Manual Select': 'กำหนดเอง',
        'select user details': 'เลือกรายละเอียดผู้ใช้',
        'all users': 'ผู้ใช้ทั้งหมด',
        'have group users': 'ผู้ใช้ที่อยู่ในกลุ่ม',
        'no group users': 'ผู้ใช้ที่อยู่นอกกลุ่ม',
        'toll type': 'ชนิดการโทร',
        'call type': 'ประเภทการโทร',
        'from route': 'เริ่มจากกลุ่มสายนอก',
        'to route': 'จนถึงกลุ่มสายนอก',
        'from trunk': 'เริ่มจากสายนอก',
        'to trunk': 'ไปสายนอก',
        'from extension': 'เริ่มจากเบอร์ภายใน',
        'to extension': 'จนถึงเบอร์ภายใน',
        'from account': 'เริ่มจากรหัสผู้ใช้',
        'to account': 'จนถึงเบอร์รหัสผู้ใช้',
        'through':'จนถึง',
        'number of calls': 'จำนวนการโทร',
        'total charges': 'ค่าใช้จ่ายทั้งหมด',
        'call durations': 'ระยะเวลาการโทร',
        'Report Group':'กลุ่มรายงาน',
        'dialled number': 'หมายเลขโทรออก',
        'destination': 'ปลายทาง',
        'internal': 'โทรภายใน',
        'incoming': 'โทรเข้า',
        'outgoing': 'โทรออก',
        'trunks':'สายนอก',
        'groups': 'กลุ่ม',
        '-groups': 'กลุ่ม',

        'hotline': 'สายด่วน',
        'local': 'ภายในพื้นที่',
        'mobile': 'มือถือ',
        'domestic': 'โทรทางไกล',
        'international': 'ต่างประเทศ',

        'free': 'ฟรี',

        //Header Report
        'extension summary report': 'รายงานสรุปเบอร์ภายใน',
        'extensions detail report': 'รายงานรายละเอียดเบอร์ภายใน',
        'group summary report': 'รายงานสรุปกลุ่ม',
        'group detail report': 'รายงานรายละเอียดกลุ่ม',
        'destination summary report': 'รายงานสรุปปลายทาง',
        'destination details report': 'รายงานรายละเอียดปลายทาง',
        'dialled number summary report': 'รายงานสรุปหมายเลขโทรออก',
        'dialled number detail report': 'รายงานรายละเอียดหมายเลขโทรออก',
        'user details report': 'รายงานรายละเอียดผู้ใช้',
        'trunk summary report': 'รายงานสรุปสายนอก',
        'trunk detail report': 'รายงานรายละเอียดสายนอก', 
        'top trunk usage report': 'รายงานการใช้สายนอกสูงสุด',
        'top dialled number usage report': 'รายงานการใช้หมายเลขโทรออกสูงสุด',
        'top destination usage report':'รายงานการใช้ปลายทางสูงสุด',
        'top extension usage report': 'รายงานการใช้เบอร์ภายในสูงสุด',
        'tranfer call report': 'รายงานการโอนสาย',

        'Report': 'รายงาน',
        'reportdate': 'รายงาน วัน',
        'viewreport': 'ดูรายงาน',
        'rank value': 'อันดับค่า',
        'DateTimeTo':'วันเวลาสิ้นสุด',
        'DateTimeFrom':'วันเวลาเริ่มต้น',
        'usage type': 'ประเภทการใช้งาน',
        'clear': 'ล้าง',

        //DashBoard 
        'connector-status': 'ไม่ทำงาน',
        'connector-status-on': 'กำลังทำงาน',
        'connector':'สถานะเชื่อมต่อ',
        'calculator-status': 'ไม่ทำงาน',
        'calculator-status-on': 'กำลังทำงาน',
        'calculator':'สถานะการคำนวณ',
        'diskfree': 'เหลือพื้นที่อยู๋',

        'caller': 'เบอร์ต้นทาง',
        'called': 'เบอร์ปลายทาง',
        'callername': 'ชื่อผู้ใช้เบอร์ต้นทาง',
        'dialnumber': 'เบอร์ปลายทาง',
        'destination': 'พื้นที่ปลายทาง',
        'starttime': 'เวลาเริ่มโทร',
        'endtime': 'เวลาจบ',
        'duration': 'ระยะเวลา',
        'rate': 'อัตราค่าบริการ',
        'cost':'ค่าบริการ',

        //_________ Report
        'Chart Reports':' รายงานรูปแบบแผนภูมิ',
        'User Reports':' รายงานส่วนของผู้ใช้',
        'Trunk Reports':' รายงานสายนอก',
        'Admin Reports':' รายงานส่วนของผู้ดูแลระบบ',
        'Top Usage Reports':' รายงานการใช้งานสูงสุด',
        'Report': 'รายงาน',
        'Case Details': 'รายละเอียดเรื่อง',
        'Case Details Report': 'รายงานรายละเอียดเรื่อง',
        'Case Details All': 'รายละเอียดเคสทั้งหมด',
        'Case Details All Report': 'รายงานรายละเอียดเคสทั้งหมด',
        'Case Status Summary': 'สรุปสถานะเคส',
        'Case Status Summary Report': 'รายงานสรุปสถานะเคส',
        'Case Type Summary': 'สรุปประเภทเคส',
        'Case Type Summary Report': 'รายงานสรุปประเภทเคส',
        'case_details': 'รายละเอียดเรื่อง',
        'case_details_report': 'รายงานรายละเอียดเรื่อง',
        'case_details_all': 'รายละเอียดเคสทั้งหมด',
        'case_details_all_report': 'รายงานรายละเอียดเคสทั้งหมด',
        'case_status_summary': 'สรุปสถานะเคส',
        'case_status_summary_report': 'รายงานสรุปสถานะเคส',
        'case_type_summary': 'สรุปประเภทเคส',
        'case_type_summary_report': 'รายงานสรุปประเภทเคส',
        'input_data_require': 'รายละเอียดรายงาน',
        'case_status': 'สถานะเคส',
        'start_date': 'วันที่เริ่มต้น',
        'end_date': 'วันที่สิ้นสุด',

        'monthly summary report': 'รายงานสรุปรายเดือน',
        'monthly charge summary report': 'รายงานสรุปค่าบริการรายเดือน',
        'transfer call report': 'รายงานการโอนสาย',
        'summary report by group': 'รายงานสรุปกลุ่ม',
        'summary report': 'รายงานสรุป',
        'account code details report': 'รายงานรายละเอียดรหัสผู้ใช้',
        'account code summary report': 'รายงานสรุปรหัสผู้ใช้',

        //Breadcrumb
        'user report': 'ผู้ใช้',
        'admin report': 'ผู้ดูเเล',
        'trunks report': 'การใช้สายนอก',
        'trunk':'สายนอก',

        //Permission
        'permission management':'จัดการสิทธิ์',
        'edit': 'แก้ไข',
        'remove': 'ลบ',
        'New':'ใหม่',
        'new': 'สร้างใหม่',
        'create': 'สร้าง',
        'save': 'บันทึก',
        'cancel':'ยกเลิก',
        'Permission': 'สิทธ์',
        'Profile ID': 'รหัสข้อมูลส่วนตัว',
        'Permission Type': 'ประเภทการอนุญาต',
        'Active': 'สถานะ',
        'Roles ProfileID': 'ตำแหน่ง (รหัสข้อมูลส่วนตัว)',
        'permissions in this role': 'สิทธ์ของตำแหน่งนี้',
        'Other permissions': 'สิทธ์อื่น',

        //Extension
        'extension:': 'เบอร์ภายใน:',
        'extension': 'เบอร์ภายใน',
        '-extension':'เบอร์ภายใน',
        'extensions': 'เบอร์ภายใน',
        'Client ID': 'รหัสไคลเอนต์',
        'Name': 'ชื่อ',
        'Org ID': 'Org ID',
        'Type': 'ประเภท',
        'License': 'ใบอนุญาต',
        'Budget': 'งบประมาณ',
        'Balance': 'งบดุล',
        'Tenant': 'ผู้เช่า',
        'Authorization code': 'รหัสอนุมัติ',
        'Rent charge': 'ค่าใช้จ่าย',
        'Search by name': 'ค้นหาด้วยชื่อ',
        'Create Extension Range': 'สร้างเบอร์ภายในแบบกำหนดช่วง',
        'Create Extension': 'สร้างเบอร์ภายใน',
        'Move to Organize': 'ย้ายองค์กร',
        'Organize List': 'รายชื่อองค์กร',
        'Organizations': 'องค์กร',
        'Normal': 'ปกติ',
        'VIP': 'วีไอพี',
        'Guest': 'ผู้มาเยือน',
        'Auth Code': 'รหัสรับรองความถูกต้อง',
        'Authorize Code': 'รหัสรับรองความถูกต้อง',
        'same extension?': 'เหมือนกับเบอร์ภายในหรือไม่',
        'islicense?': 'ใช้ใบอนุญาตหรือไม่',
        'Create Ext.': 'สร้างเบอร์ภายใน',
        'move to main': 'ย้ายไปกลุ่มหลัก',
        'delete group': 'ลบกลุ่ม',
        //User Management
        'close': 'ปิด',
        'User Management': 'จัดการผู้ใช้',
        'Users Management': 'จัดการผู้ใช้',
        'Group ID': 'รหัสกลุ่ม',
        'Parent Group': 'Parent Group',
        'Group name': 'ชื่อกลุ่ม',
        'Username': 'ชื่อผู้ใช้',
        'Password': 'รหัสผ่าน',
        'Role': 'ตำแหน่ง',
        'Company': 'บริษัท',
        'New User': 'ผู้ใช้ใหม่',
        'Fax':'หมายเลขแฟกซ์',
        'Email': 'จดหมายอิเล็กทรอนิกส์',
        'Role Name':'ตำแหน่ง',
        'Add New User':'เพิ่มผู้ใช้ใหม่',
        'Enter Username':'ชื่อผู้ใช้',
        'Enter Password':'รหัสผ่าน',
        'Enter Rolename':'ตำแหน่ง',
        'Enter Extension':'เบอร์ภายใน',
        'Enter Name':'ชื่อ',
        'Enter Company':'ชื่อบริษัท',
        'Enter Mobile':'หมายเลขโทรศัพท์',
        'Enter Fax':'หมายเลขแฟกซ์',
        'Enter Email':'จดหมายอิเล็กทรอนิกส์',
        'Enter Active': 'สถานะ',

        //Trunks&TrunkDetail
        'please select at least 1 user':'กรุณาเลือกอย่างน้อย 1 ผู้ใช้งาน',
        'create trunk': 'สร้างสายนอก',
        'create group': 'สร้างกลุ่ม',
        'move group': 'ย้ายกลุ่ม',
        'edit group': 'แก้ไขกลุ่ม',
        'route': 'กลุ่มสายนอก',
        'trk_name': 'ชื่อสายนอก',
        'updated_on':'แก้ไขล่าสุด',
        'has_child': 'Has Child',
        'info': 'ข้อมูล',
        '-trunks': 'สายนอก',
        'detail': 'รายละเอียด',
        'create at': 'สร้างเมื่อ',
        'last updated': 'อัพเดตล่าสุดเมื่อ',
        'add':'เพิ่ม',
        'update': 'อัพเดต',
        'delete': 'ลบ',
        'none': 'ไม่มี',
        'license create at': 'ใบอนุญาตสร้างเมื่อ',

        //Roles Management
        'Roles Management': 'จัดการตำแหน่ง',
        'Users in this role': 'ผู้ใช้ในตำเเหน่งนี้',
        'Other user': 'ผู้ใช้รายอื่น',
        'Apply': 'ใช้',
        'Back to Form': 'กลับไปที่แบบฟอร์ม',
        'Back': 'กลับ',

        //Locataions
        'location': 'ตำแหน่งที่ตั้ง',
        'new location': 'ตำแหน่งที่ตั้งใหม่',
        'add new areacode':'เพิ่มรหัสพื้นที่ใหม่',
        'add new location': 'เพิ่มตำแหน่งที่ตั้งใหม่',
        'charging model': 'รูปแบบการชาร์จ',
        'enter route name': 'ชื่อกลุ่มสายนอก',
        'enter route': 'กลุ่มสายนอก',
        'enter trunk name': 'ชื่อสายนอก',
        'enter trunk': 'สายนอก',
        'enter reqex': 'กำหนดรูปแบบคำนำหน้า',
        'enter regex': 'Enter regex',
        'enter location name': 'ชื่อตำแหน่ง',
        'enter reqex for prefix':'Enter regex for reqex',
        'enter regex for provider': 'Enter regex for provider',
        'enter provider code': 'รหัสผู้ให้บริการ',
        'enter area code': 'รหัสพื้นที่',
        'enter area name': 'ชื่อพื้นที่',
        'select toll type': 'เลือกประเภทการโทร',
        'select rate name': 'เลือกชื่อเรท',
        'select day of week': 'เลือกวัน',
        'enter charging data': 'ข้อมูล ชาร์จ',
        'tariff table': 'ตารางอัตราราคาโทร',
        'prefix': 'นำหน้า',
        'provider': 'ผู้ให้บริการ',
        'model': 'รูปแบบ',
        'tariff': 'อัตราราคาโทร',
        'select tariff table': 'เลือกตารางอัตราราคาโทร',

        //Tariff
        'Copy Areacode Data': 'คัดลอกข้อมูลรหัสพื้นที่',
        'Areacode': 'รหัสพื้นที่',
        'New Areacode': 'รหัสพื้นที่ใหม่',
        'Areacodes': 'รหัสพื้นที่',
        'Copy Rate Data': 'คัดลอกข้อมูลอัตรา',
        'Copy Table': 'คัดลอก ตาราง',
        'Copy Tariff Table': 'คัดลอก ตาราง อัตรา',
        'New Rate': 'อัตราใหม่',
        'Charging': 'ชาร์จ',
        'Add New Rate': 'เพิ่มอัตราใหม่',
        'Rates': 'อัตรา',
        'Rate ID': 'รหัสอัตรา',
        'Rate Name': 'ชื่ออัตรา',
        'Any Day': 'วันใดวันหนึ่ง',
        'Day Of Week': 'วันของสัปดาห์',
        'Weekday': 'วันธรรมดา',
        'Holiday': 'วันหยุด',
        'Monday': 'วันจันทร์',
        'Tuesday': 'วันอังคาร',
        'Wednesday': 'วันพุธ',
        'Thursday': 'วันพฤหัสบดี',
        'Friday': 'วันศุกร์',
        'Saturday': 'วันเสาร์',
        'Sunday': 'วันอาทิตย์',
        'Enter rate id': 'รหัสอัตรา',
        'Enter rate name':'ชื่ออัตรา',
        'Enter start time':'เวลาเริ่ม',
        'Enter end time':'เวลาสิ้นสุด',
        'Enter charging rate in JSON Array format': 'อัตราการชาร์จในรูปแบบ JSON Array',

        //Directory Search 
        '-directorysearch':'ค้นหาข้อมูลบุคคล',
        'rent_dial_number_fee': 'ค่าเช่าหมายเลข',
        'special_service_fee': 'ค่าบริการเฉพาะ',
        'org_path': 'องค์กร',
        'nameth': 'ชื่อ(ไทย)',
        'name': 'ชื่อ(อังกฤษ)',
        'exttype': 'ประเภทเบอร์ภายใน',
        'email': 'จดหมายอิเล็กทรอนิกส์',
        'authorization_code': 'รหัสการอนุญาต',
        'no record data': 'ไม่มีข้อมูลบันทึก',
        'callout': 'โทรออก',
        'callin': 'โทรเข้า',
        'position': 'ตำแหน่ง',

        //Recalculate
        '-recalculate':'คำนวณค่าโทรใหม่',
        'recalculate by date': 'คำนวณค่าโทรใหม่ โดย วัน',
        'recalculate by tolltype': 'คำนวณค่าโทรใหม่ โดย  ชนิดการโทร',
        'recalculate by group': 'คำนวณค่าโทรใหม่ โดย  กลุ่ม',
        'recalculate by extension': 'คำนวณค่าโทรใหม่ โดย  เบอร์ภายใน',
        'loading':'กำลังโหลด',
    }
  });

  update_texts();
});