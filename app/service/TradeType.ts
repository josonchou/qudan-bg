import { Service, Context } from 'egg';
import sequelize = require('sequelize');


export default class TradeType extends Service {
  model: sequelize.Sequelize;

  constructor(ctx: Context) {
    super(ctx)

    this.model = ctx.model
  }

  async findList(filter) {
    const { offset, limit } = this.ctx.helper.parsedPageFromParams(filter);

    let sql = `
    SELECT tt.*, u.invite_code FROM trade_type tt LEFT JOIN user u ON u.id = tt.user_id WHERE tt.send_status = 2
    `
    
    const totals = await this.model.query(`
    SELECT count(*) c FROM (${sql}) AS temp
    `, { type: this.model.QueryTypes.SELECT });

    sql += ' ORDER BY create_time DESC';
    sql += ' LIMIT :offset, :limit';

    const list = await this.model.query(sql, {
      replacements: { offset, limit },
      type: this.model.QueryTypes.SELECT,
    });
    return {
      list,
      page: filter.page,
      pageSize: filter.pageSize,
      total: totals[0].c,
    };
  }

  async findMonthReport(filter) {
    const { offset, limit } = this.ctx.helper.parsedPageFromParams(filter);

    let sql = `
    SELECT temp.ymonth, SUM(IF(temp.trade_type=4, temp.price, 0)) income, SUM(IF(temp.trade_type<>4, temp.price, 0)) outcome FROM (
      SELECT DISTINCT tt.id, tt.price, tt.trade_type, DATE_FORMAT(tt.create_time,'%Y年%m月') ymonth FROM trade_type tt WHERE tt.send_status = 2
    ) AS temp GROUP BY temp.ymonth
    `
    
    const totals = await this.model.query(`
    SELECT count(*) c FROM (${sql}) AS temp
    `, { type: this.model.QueryTypes.SELECT });

    sql += ' ORDER BY temp.ymonth DESC';
    sql += ' LIMIT :offset, :limit';

    const list = await this.model.query(sql, {
      replacements: { offset, limit },
      type: this.model.QueryTypes.SELECT,
    });

    return {
      list,
      page: filter.page,
      pageSize: filter.pageSize,
      total: totals[0].c,
    };
  }

  async findSalaryList(filter) {
    const { offset, limit } = this.ctx.helper.parsedPageFromParams(filter);

    let sql = `
    SELECT tt.*, aly.apply_id_code apply_id_code, u.invite_code invite_code FROM trade_type tt 
    LEFT JOIN user u ON u.id = tt.user_id 
    LEFT JOIN apply aly ON aly.id = tt.apply_id
    WHERE tt.trade_type IN (2,3,5)
    `
    
    const totals = await this.model.query(`
    SELECT count(*) c FROM (${sql}) AS temp
    `, { type: this.model.QueryTypes.SELECT });

    sql += ' LIMIT :offset, :limit';

    const list = await this.model.query(sql, {
      replacements: { offset, limit },
      type: this.model.QueryTypes.SELECT,
    });

    return {
      list,
      page: filter.page,
      pageSize: filter.pageSize,
      total: totals[0].c,
    };
  }

  async passSalary(id: number) {

    const founded = await this.model.TradeType.findOne({
      where: {
        id,
      },
    });

    if (!founded) {
      this.ctx.throw(404, 'not found this salary record');
      return
    }

    await this.model.TradeType.update({
      status: 2,
      send_status: 2,
    }, {
      where: {
        id,
      }
    });

    return {
      id,
    };
  }

  async refuseSalary(id: number, msg: string) {
    const founded = await this.model.TradeType.findOne({
      where: {
        id,
      },
    });

    if (!founded) {
      this.ctx.throw(404, 'not found this salary record');
      return
    }

    await this.model.TradeType.update({
      status: 3,
      remark: msg,
      reject_reason: msg,
    }, {
      where: {
        id,
      }
    });

    return {
      id,
    };
  }

  async findWithdrawList(filters) {
    const { ctx } = this;
    const { offset, limit } = ctx.helper.parsedPageFromParams(filters);

    let where = '';

    if (filters.invite_code) {
      where += ` AND u.invite_code LIKE '%${filters.invite_code}%'`;
    }

    if (filters.register_mobile) {
      where += ` AND u.register_mobile LIKE '%${filters.register_mobile}%'`;
    }

    if (filters.status === 'pending') {
      where += ` AND tt.status = 1`;
    }


    if (filters.status === 'passed') {
      where += ` AND tt.status = 2`;
    }

    if (filters.status === 'refused') {
      where += ` AND tt.status = 3`;
    }

    let sql = `
    SELECT 
      tt.id, # 提现编号
      tt.trade_type, # 交易类型
      tt.apply_id, # 申请ID
      tt.price, # 提现金额
      tt.create_time, # 
      tt.modify_time,
      tt.status, # 审核状态
      tt.account, # 账户ID
      tt.reject_reason, # 拒绝理由
      tt.remark, # 备注
      tt.tx_name, # 提现姓名
      tt.user_id, # 用户ID
      tt.audit_time, # 审核时间
      tt.send_time, # 发放时间
      tt.send_status, # 发放状态
      tt.tx_alipay_no, # 体现支付宝账号
      u.register_mobile, # 手机号
      u.invite_code # 用户编号
    FROM trade_type tt 
    LEFT JOIN user u ON u.id = tt.user_id
    WHERE tt.trade_type = 1 ${where}
    `
    const totals = await this.model.query(`
    SELECT count(*) c FROM (${sql}) AS temp
    `, { type: this.model.QueryTypes.SELECT });

    sql += ' ORDER BY modify_time DESC';
    sql += ' LIMIT :offset, :limit';

    const list = await this.model.query(sql, {
      replacements: { offset, limit },
      type: this.model.QueryTypes.SELECT,
    });

    return {
      list,
      page: filters.page,
      pageSize: filters.pageSize,
      total: totals[0].c,
    };
  }

  async passWithdraw(id: number) {

    const founded = await this.model.TradeType.findOne({
      where: {
        id,
      },
    });

    if (!founded) {
      this.ctx.throw(404, 'not found this salary record');
      return
    }

    await this.model.TradeType.update({
      status: 2,
      audit_time: new Date(),
    }, {
      where: {
        id,
      }
    });

    return {
      id,
    };
  }

  async refuseWithdraw(id: number, msg: string) {
    const founded = await this.model.TradeType.findOne({
      where: {
        id,
      },
    });

    if (!founded) {
      this.ctx.throw(404, 'not found this salary record');
      return
    }

    await this.model.TradeType.update({
      status: 3,
      remark: msg,
      reject_reason: msg,
      audit_time: new Date(),
    }, {
      where: {
        id,
      }
    });

    return {
      id,
    };
  }

  async finishedWithdraw(id: number) {
    const founded = await this.model.TradeType.findOne({
      where: {
        id,
      },
    });

    if (!founded) {
      this.ctx.throw(404, 'not found this salary record');
      return
    }

    await this.model.TradeType.update({
      send_status: 2,
      send_time: new Date(),
    }, {
      where: {
        id,
      }
    });

    return {
      id,
    };
  }
}