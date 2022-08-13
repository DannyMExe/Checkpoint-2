const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE,
});

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Task.belongsTo(Owner);
Owner.hasMany(Task);

Task.clearCompleted = async function(){
  await Task.destroy({
    where: {
      complete: true
    }
  })
}

Task.completeAll = async function(){
  await Task.update({ complete: true },{ where: { complete: false } })
};

Task.prototype.getTimeRemaining = function () {
  return !this.due ? Infinity : Math.abs(this.due - new Date())
}

Task.prototype.isOverdue = function () {
  return this.due < new Date() && !this.complete ? true: false
};

Task.prototype.assignOwner = function (owner) {
  this.OwnerId = owner.id;
  return this;
};

Owner.getOwnersAndTasks = function () {
  return Owner.findAll({
    include: Task
  });
};

Owner.prototype.getIncompleteTasks = async function () {
  const incTasks = await Owner.findOne({
    where: {
      name: this.name
    },
    include: {
      model: Task,
      where: { 
        complete: false
      }
    }
  });
  return incTasks.Tasks;
}

Owner.beforeDestroy(instance => {
  if(instance.name === 'Grace Hopper'){
    throw new Error('Grace Hopper cant be destroyed');
  }
});


//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
