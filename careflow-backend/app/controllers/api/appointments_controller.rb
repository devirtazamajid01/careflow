class Api::AppointmentsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def index
    scope = Appointment.includes(:client).order(:scheduled_at)
    collection, page, per_page = paginate(scope)
    render json: {
      data: collection.as_json(include: { client: { only: [:name, :email, :phone] } }),
      meta: { page: page, per_page: per_page, total: scope.count }
    }
  end

  def create
    appointment = Appointment.new(appointment_params)
    if appointment.save
      ExternalSyncService.new.create_appointment(appointment)
      render json: appointment, status: :created
    else
      render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    appointment = Appointment.find(params[:id])
    if appointment.update(appointment_params)
      render json: appointment
    else
      render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    appointment = Appointment.find(params[:id])
    appointment.destroy
    head :no_content
  end

  private

  def appointment_params
    params.require(:appointment).permit(:client_id, :scheduled_at, :notes)
  end

  def record_not_found
    render json: { error: 'Appointment not found' }, status: :not_found
  end
end 
