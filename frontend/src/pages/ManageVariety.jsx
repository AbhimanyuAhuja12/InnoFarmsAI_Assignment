"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ManageVarietyHeader from "../components/manage/ManageVarietyHeader"
import VarietyForm from "../components/manage/VarietyForm"
import LoadingState from "../components/manage/LoadingState"
import ErrorState from "../components/manage/ErrorState"
import { useManageVariety } from "../hooks/useManageVariety"

export default function ManageVariety() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const {
    loading,
    submitting,
    apiError,
    formData,
    errors,
    estimatedHarvestDate,
    handleChange,
    handleSelectChange,
    handleSubmit,
    fetchVariety,
  } = useManageVariety(id, navigate, isEditing)

  useEffect(() => {
    if (isEditing) {
      fetchVariety()
    }
  }, [id, isEditing, fetchVariety])

  if (loading) {
    return <LoadingState />
  }

  if (apiError && !submitting) {
    return <ErrorState apiError={apiError} isEditing={isEditing} navigate={navigate} fetchVariety={fetchVariety} />
  }

  return (
    <div className="min-h-screen pb-12">
      <ManageVarietyHeader isEditing={isEditing} />

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <VarietyForm
          isEditing={isEditing}
          formData={formData}
          errors={errors}
          estimatedHarvestDate={estimatedHarvestDate}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          submitting={submitting}
          navigate={navigate}
        />
      </div>
    </div>
  )
}
